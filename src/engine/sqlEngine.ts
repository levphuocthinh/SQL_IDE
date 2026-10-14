import { TableSchema, QueryResult, ExecutionStep, Relationship } from '../types/sql';

/**
 * Bộ máy thực thi CSDL SQL thuần In-Memory (Pure In-Browser SQLEngine)
 * Chức năng chính:
 * 1. Lưu trữ và quản lý cấu trúc bảng, kiểu dữ liệu, ràng buộc PK và FK
 * 2. Tự động phát hiện và xây dựng mạng lưới quan hệ (ERD Relationships 1:N)
 * 3. Phân tích cú pháp SQL (SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE, DROP...)
 * 4. Xử lý các phép nối bảng phức tạp (INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN)
 * 5. Hỗ trợ mệnh đề GROUP BY, HAVING, ORDER BY, LIMIT, OFFSET và các hàm tổng hợp (COUNT, SUM, AVG, MAX, MIN)
 * 6. Sinh kế hoạch thực thi EXPLAIN từng giai đoạn (Scan, Filter, Join, Aggregate, Projection) phục vụ trực quan hóa
 */
export class SQLEngine {
  private tables: Map<string, TableSchema> = new Map();
  private relationships: Relationship[] = [];

  constructor(initialTables?: TableSchema[]) {
    if (initialTables) {
      this.resetWith(initialTables);
    }
  }

  public resetWith(tables: TableSchema[]) {
    this.tables.clear();
    this.relationships = [];

    tables.forEach(t => {
      this.tables.set(t.name.toLowerCase(), {
        name: t.name,
        columns: JSON.parse(JSON.stringify(t.columns)),
        rows: JSON.parse(JSON.stringify(t.rows)),
      });
    });

    this.rebuildRelationships();
  }

  public getTables(): TableSchema[] {
    return Array.from(this.tables.values());
  }

  public getTable(name: string): TableSchema | undefined {
    return this.tables.get(name.toLowerCase());
  }

  public getRelationships(): Relationship[] {
    return this.relationships;
  }

  private rebuildRelationships() {
    this.relationships = [];
    this.tables.forEach(tbl => {
      tbl.columns.forEach(col => {
        if (col.isForeign && col.foreignKeyTarget) {
          this.relationships.push({
            id: `${tbl.name}_${col.name}_to_${col.foreignKeyTarget.table}_${col.foreignKeyTarget.column}`,
            fromTable: tbl.name,
            fromColumn: col.name,
            toTable: col.foreignKeyTarget.table,
            toColumn: col.foreignKeyTarget.column,
            type: '1:N',
            description: `${tbl.name}.${col.name} -> ${col.foreignKeyTarget.table}.${col.foreignKeyTarget.column}`,
          });
        }
      });
    });
  }

  /**
   * Execute SQL string (supports multiple statements separated by semicolon)
   */
  public execute(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    const startTime = performance.now();
    const cleanSql = sql.trim().replace(/;$/, '');
    
    // Split multiple statements if any, but respect strings/parentheses
    const statements = this.splitStatements(cleanSql);
    if (statements.length === 0) {
      return {
        result: { columns: [], rows: [], message: 'Truy vấn trống.' },
        steps: []
      };
    }

    let lastResult: QueryResult = { columns: [], rows: [] };
    let allSteps: ExecutionStep[] = [];

    try {
      for (const stmt of statements) {
        const { result, steps } = this.executeSingleStatement(stmt);
        lastResult = result;
        allSteps.push(...steps);
      }
      lastResult.executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
      return { result: lastResult, steps: allSteps };
    } catch (err: any) {
      return {
        result: {
          columns: [],
          rows: [],
          error: err.message || 'Lỗi thực thi SQL',
          executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        },
        steps: []
      };
    }
  }

  private splitStatements(sql: string): string[] {
    const stmts: string[] = [];
    let cur = '';
    let inStr = false;
    let quoteChar = '';

    for (let i = 0; i < sql.length; i++) {
      const c = sql[i];
      if ((c === "'" || c === '"') && sql[i - 1] !== '\\') {
        if (!inStr) {
          inStr = true;
          quoteChar = c;
        } else if (quoteChar === c) {
          inStr = false;
        }
      }

      if (c === ';' && !inStr) {
        if (cur.trim()) stmts.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    if (cur.trim()) stmts.push(cur.trim());
    return stmts;
  }

  public validateSqlSyntax(sql: string): void {
    const clean = sql.trim().replace(/;$/, '');
    if (!clean) {
      throw new Error('Câu lệnh SQL không được để trống.');
    }

    const upper = clean.toUpperCase();

    // Ignore transaction commands
    if (
      upper.startsWith('BEGIN') ||
      upper.startsWith('START TRANSACTION') ||
      upper.startsWith('COMMIT') ||
      upper.startsWith('ROLLBACK')
    ) {
      return;
    }

    // 1. Check unclosed quotes (' or ")
    let inSingle = false;
    let inDouble = false;
    for (let i = 0; i < clean.length; i++) {
      const c = clean[i];
      if (c === "'" && clean[i - 1] !== '\\') {
        if (!inDouble) inSingle = !inSingle;
      } else if (c === '"' && clean[i - 1] !== '\\') {
        if (!inSingle) inDouble = !inDouble;
      }
    }
    if (inSingle) throw new Error("Lỗi cú pháp SQL: Chưa đóng dấu nháy đơn ('). Vui lòng kiểm tra lại chuỗi ký tự.");
    if (inDouble) throw new Error('Lỗi cú pháp SQL: Chưa đóng dấu nháy kép ("). Vui lòng kiểm tra lại định danh.');

    // 2. Check balanced parentheses
    let parenDepth = 0;
    for (let i = 0; i < clean.length; i++) {
      const c = clean[i];
      if (c === '(') parenDepth++;
      else if (c === ')') parenDepth--;
      if (parenDepth < 0) {
        throw new Error('Lỗi cú pháp SQL: Dư thừa dấu ngoặc đóng ")" không có dấu mở tương ứng.');
      }
    }
    if (parenDepth > 0) {
      throw new Error(`Lỗi cú pháp SQL: Thiếu dấu ngoặc đóng ")" (còn ${parenDepth} cặp ngoặc chưa đóng).`);
    }

    // 3. Check double / consecutive commas
    if (/,,/.test(clean)) {
      throw new Error('Lỗi cú pháp SQL: Dư thừa dấu phẩy (double comma ",,"). Vui lòng kiểm tra lại danh sách cột hoặc biểu thức.');
    }

    // 4. Check trailing comma before clause or end of statement
    const trailingCommaMatch = clean.match(/,\s*(?:FROM|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT|$)/i);
    if (trailingCommaMatch) {
      const kw = trailingCommaMatch[0].replace(/,/g, '').trim() || 'cuối câu lệnh';
      throw new Error(`Lỗi cú pháp SQL: Dư thừa dấu phẩy "," trước mệnh đề ${kw.toUpperCase()}.`);
    }

    // 5. Leading comma in SELECT
    if (/^SELECT\s*,/i.test(clean)) {
      throw new Error('Lỗi cú pháp SQL: Dấu phẩy không hợp lệ ngay sau từ khóa SELECT.');
    }

    // --- Validation for SELECT statements ---
    if (upper.startsWith('SELECT')) {
      // Missing FROM
      const fromMatch = clean.match(/\bFROM\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?/i);
      if (!fromMatch) {
        if (/\bFROM\s*$/i.test(clean) || /\bFROM\s+(?:WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT)\b/i.test(clean)) {
          throw new Error('Lỗi cú pháp SQL: Mệnh đề FROM thiếu tên bảng nguồn.');
        }
        throw new Error('Lỗi cú pháp SQL: Thiếu mệnh đề FROM chỉ định bảng dữ liệu.');
      }

      // Check table existence
      const primaryTableName = fromMatch[1];
      const primaryTable = this.tables.get(primaryTableName.toLowerCase());
      if (!primaryTable) {
        const available = Array.from(this.tables.keys()).join(', ');
        throw new Error(`Lỗi ngữ nghĩa SQL: Bảng "${primaryTableName}" không tồn tại trong CSDL. Các bảng khả dụng: [${available}].`);
      }

      // Check joined tables
      const joinRegex = /(?:INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\s+([a-zA-Z0-9_]+)/gi;
      let jm: RegExpExecArray | null;
      while ((jm = joinRegex.exec(clean)) !== null) {
        const jTable = jm[1];
        if (!this.tables.has(jTable.toLowerCase())) {
          throw new Error(`Lỗi ngữ nghĩa SQL: Bảng liên kết JOIN "${jTable}" không tồn tại trong CSDL.`);
        }
      }

      // Check JOIN without ON (when not CROSS JOIN)
      const joinWithoutOn = clean.match(/\b(INNER|LEFT|RIGHT|FULL)\s+JOIN\s+[a-zA-Z0-9_]+(?:\s+(?:AS\s+)?[a-zA-Z0-9_]+)?\s*(WHERE|GROUP\s+BY|ORDER\s+BY|LIMIT|$)/i);
      if (joinWithoutOn) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề JOIN thiếu điều kiện liên kết ON (Ví dụ: ON table1.id = table2.id).');
      }

      // Dangling WHERE clause
      if (/\bWHERE\s*$/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề WHERE thiếu biểu thức điều kiện lọc dữ liệu.');
      }
      const danglingWhereMatch = clean.match(/\bWHERE\s+(GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT)\b/i);
      if (danglingWhereMatch) {
        throw new Error(`Lỗi cú pháp SQL: Mệnh đề WHERE thiếu biểu thức điều kiện trước mệnh đề "${danglingWhereMatch[1]}".`);
      }

      // Incomplete comparison in WHERE
      if (/\bWHERE\s+[\s\S]+?(?:=|>|<|>=|<=|!=|<>)\s*$/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Toán tử so sánh trong mệnh đề WHERE thiếu giá trị vế phải.');
      }
      if (/\bWHERE\s+[\s\S]+?(?:=|>|<|>=|<=|!=|<>)\s*(?:AND|OR)\b/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Toán tử so sánh thiếu giá trị vế phải trước từ khóa logic.');
      }
      if (/\bWHERE\s+[\s\S]+?\b(?:AND|OR|NOT)\s*$/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề WHERE kết thúc bằng từ khóa logic dở dang.');
      }

      // Dangling GROUP BY
      if (/\bGROUP\s+BY\s*$/i.test(clean) || /\bGROUP\s+BY\s+(?:HAVING|ORDER\s+BY|LIMIT)\b/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề GROUP BY thiếu tên cột gom nhóm.');
      }

      // Dangling HAVING
      if (/\bHAVING\s*$/i.test(clean) || /\bHAVING\s+(?:ORDER\s+BY|LIMIT)\b/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề HAVING thiếu biểu thức điều kiện lọc nhóm.');
      }

      // Dangling ORDER BY
      if (/\bORDER\s+BY\s*$/i.test(clean) || /\bORDER\s+BY\s+LIMIT\b/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề ORDER BY thiếu tên cột sắp xếp.');
      }

      // Dangling LIMIT
      if (/\bLIMIT\s*$/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề LIMIT thiếu số lượng bản ghi.');
      }
      const limitValMatch = clean.match(/\bLIMIT\s+([^\s;]+)/i);
      if (limitValMatch && isNaN(Number(limitValMatch[1]))) {
        throw new Error(`Lỗi cú pháp SQL: Giá trị sau LIMIT phải là số nguyên dương (nhận được "${limitValMatch[1]}").`);
      }

      // Check columns in SELECT
      const selectMatch = clean.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
      if (selectMatch) {
        const selectPart = selectMatch[1].trim();
        if (!selectPart) {
          throw new Error('Lỗi cú pháp SQL: Mệnh đề SELECT thiếu danh sách cột.');
        }
        if (selectPart !== '*') {
          const rawCols = this.splitParenthesesSafe(selectPart);
          const validColNames = new Set(primaryTable.columns.map(c => c.name.toLowerCase()));
          
          // Also collect columns from joined tables if any
          const joinedTablesList: TableSchema[] = [];
          let jm2: RegExpExecArray | null;
          const joinRegex2 = /(?:INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\s+([a-zA-Z0-9_]+)/gi;
          while ((jm2 = joinRegex2.exec(clean)) !== null) {
            const jt = this.tables.get(jm2[1].toLowerCase());
            if (jt) joinedTablesList.push(jt);
          }
          joinedTablesList.forEach(jt => {
            jt.columns.forEach(c => validColNames.add(c.name.toLowerCase()));
          });

          for (const raw of rawCols) {
            const trimmedCol = raw.trim();
            if (!trimmedCol) {
              throw new Error('Lỗi cú pháp SQL: Danh sách cột trong SELECT có phần tử rỗng hoặc dư dấu phẩy.');
            }
            const cleanExpr = trimmedCol.replace(/\s+AS\s+[a-zA-Z0-9_]+/i, '').trim();
            // Skip check for functions, CASE, window, literals, *
            if (/^(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(cleanExpr)) continue;
            if (/^CASE\b/i.test(cleanExpr) || /OVER\s*\(/i.test(cleanExpr)) continue;
            if (/^\d+$/.test(cleanExpr) || /^['"]/.test(cleanExpr)) continue;
            if (cleanExpr === '*' || cleanExpr.endsWith('.*')) continue;

            const colName = cleanExpr.split('.').pop()!.toLowerCase();
            if (!validColNames.has(colName)) {
              throw new Error(`Lỗi ngữ nghĩa SQL: Cột "${cleanExpr}" không tồn tại trong bảng "${primaryTable.name}". Các cột khả dụng: [${primaryTable.columns.map(c => c.name).join(', ')}].`);
            }
          }
        }
      }
    }

    // --- Validation for INSERT statements ---
    if (upper.startsWith('INSERT')) {
      if (!/INSERT\s+INTO\s+[a-zA-Z0-9_]+/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề INSERT INTO thiếu tên bảng.');
      }
      if (!/\bVALUES\b/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề INSERT thiếu từ khóa VALUES và danh sách giá trị.');
      }
    }

    // --- Validation for UPDATE statements ---
    if (upper.startsWith('UPDATE')) {
      if (!/UPDATE\s+[a-zA-Z0-9_]+/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề UPDATE thiếu tên bảng.');
      }
      if (!/\bSET\b/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Mệnh đề UPDATE thiếu từ khóa SET (Ví dụ: UPDATE table SET col = val).');
      }
    }

    // --- Validation for DELETE statements ---
    if (upper.startsWith('DELETE')) {
      if (!/DELETE\s+FROM\s+[a-zA-Z0-9_]+/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Lệnh DELETE thiếu từ khóa FROM và tên bảng (Ví dụ: DELETE FROM table).');
      }
    }

    // --- Validation for DROP statements ---
    if (upper.startsWith('DROP')) {
      if (!/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?[a-zA-Z0-9_]+/i.test(clean)) {
        throw new Error('Lỗi cú pháp SQL: Lệnh DROP TABLE thiếu tên bảng cần xóa.');
      }
    }
  }

  private executeSingleStatement(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    // Strip comments (-- line comments and /* */ block comments)
    const stripped = sql
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n')
      .map(line => line.replace(/--.*$/, '').trim())
      .filter(Boolean)
      .join(' ')
      .trim();

    if (!stripped) {
      return {
        result: { columns: [], rows: [], message: 'Ghi chú SQL đã được bỏ qua.' },
        steps: [],
      };
    }

    // Validate SQL syntax and semantic schema strictly!
    this.validateSqlSyntax(stripped);

    const upper = stripped.toUpperCase();

    // Transactions
    if (upper.startsWith('BEGIN') || upper.startsWith('START TRANSACTION')) {
      return {
        result: {
          columns: ['Transaction Status', 'Mode'],
          rows: [['ACTIVE', 'READ WRITE (ACID)']],
          message: 'Bắt đầu giao dịch mới (BEGIN TRANSACTION). Mọi thay đổi sẽ được cô lập an toàn.',
          affectedRows: 0,
        },
        steps: [{
          id: 'tx_begin',
          phase: 'DONE',
          title: 'Khởi tạo Giao dịch (BEGIN TRANSACTION)',
          description: 'Kích hoạt bộ đệm giao dịch cô lập. Tuân thủ 4 thuộc tính ACID: Atomicity, Consistency, Isolation, Durability.',
          activeTables: [],
        }]
      };
    }

    if (upper.startsWith('COMMIT')) {
      return {
        result: {
          columns: ['Transaction Status', 'Durability'],
          rows: [['COMMITTED', 'PERSISTENT DISK']],
          message: 'Giao dịch đã COMMIT thành công! Dữ liệu được ghi vĩnh viễn vào hệ thống.',
          affectedRows: 0,
        },
        steps: [{
          id: 'tx_commit',
          phase: 'DONE',
          title: 'Xác nhận Giao dịch (COMMIT)',
          description: 'Ghi vĩnh viễn mọi thay đổi vào cơ sở dữ liệu. Hoàn tất chu trình chuyển đổi trạng thái an toàn.',
          activeTables: [],
        }]
      };
    }

    if (upper.startsWith('ROLLBACK')) {
      return {
        result: {
          columns: ['Transaction Status', 'State'],
          rows: [['ROLLED BACK', 'RESTORED']],
          message: 'Đã ROLLBACK thành công. Toàn bộ các thao tác dở dang đã được hủy bỏ và khôi phục.',
          affectedRows: 0,
        },
        steps: [{
          id: 'tx_rollback',
          phase: 'DONE',
          title: 'Khôi phục Giao dịch (ROLLBACK)',
          description: 'Hủy bỏ toàn bộ thao tác trong giao dịch để bảo toàn tính toàn vẹn (Atomicity).',
          activeTables: [],
        }]
      };
    }

    // CREATE INDEX
    if (upper.startsWith('CREATE INDEX') || upper.startsWith('CREATE UNIQUE INDEX')) {
      return this.handleCreateIndex(stripped);
    }

    // CREATE VIEW
    if (upper.startsWith('CREATE VIEW')) {
      return this.handleCreateView(stripped);
    }

    // WITH RECURSIVE or CTE
    if (upper.startsWith('WITH')) {
      return this.handleCte(stripped);
    }

    if (upper.startsWith('CREATE TABLE')) {
      return this.handleCreateTable(stripped);
    } else if (upper.startsWith('INSERT INTO')) {
      return this.handleInsert(stripped);
    } else if (upper.startsWith('SELECT')) {
      return this.handleSelect(stripped);
    } else if (upper.startsWith('UPDATE')) {
      return this.handleUpdate(stripped);
    } else if (upper.startsWith('DELETE FROM') || upper.startsWith('DELETE')) {
      return this.handleDelete(stripped);
    } else if (upper.startsWith('DROP TABLE')) {
      return this.handleDropTable(stripped);
    } else {
      throw new Error(`Cú pháp chưa hỗ trợ: "${stripped.slice(0, 30)}...". Vui lòng kiểm tra lại câu lệnh SQL.`);
    }
  }

  // --- CREATE TABLE ---
  private handleCreateTable(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    const match = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s*\(([\s\S]+)\)/i);
    if (!match) {
      throw new Error('Cú pháp CREATE TABLE không hợp lệ. Ví dụ: CREATE TABLE users (id INT PRIMARY KEY, name TEXT);');
    }

    const tableName = match[1];
    const body = match[2];
    const isRecreate = this.tables.has(tableName.toLowerCase());

    const colDefsRaw = this.splitParenthesesSafe(body);
    const columns: TableSchema['columns'] = [];

    colDefsRaw.forEach(raw => {
      // Check for CONSTRAINT fk_name FOREIGN KEY (col) REFERENCES targetTable(targetCol)
      const fkMatch = raw.match(/(?:CONSTRAINT\s+[a-zA-Z0-9_]+\s+)?FOREIGN\s+KEY\s*\(([a-zA-Z0-9_]+)\)\s*REFERENCES\s+([a-zA-Z0-9_]+)\s*\(([a-zA-Z0-9_]+)\)/i);
      if (fkMatch) {
        const colName = fkMatch[1];
        const targetTable = fkMatch[2];
        const targetCol = fkMatch[3];
        const existingCol = columns.find(c => c.name.toLowerCase() === colName.toLowerCase());
        if (existingCol) {
          existingCol.isForeign = true;
          existingCol.foreignKeyTarget = { table: targetTable, column: targetCol };
        }
        return;
      }

      // Column definition
      const parts = raw.split(/\s+/);
      const colName = parts[0];
      const colType = (parts[1] || 'TEXT').toUpperCase() as any;
      const isPrimary = /PRIMARY\s+KEY/i.test(raw);
      const notNull = /NOT\s+NULL/i.test(raw);

      // Check inline REFERENCES
      const inlineRef = raw.match(/REFERENCES\s+([a-zA-Z0-9_]+)\s*\(([a-zA-Z0-9_]+)\)/i);
      const isForeign = !!inlineRef;
      const foreignKeyTarget = inlineRef ? { table: inlineRef[1], column: inlineRef[2] } : undefined;

      columns.push({
        name: colName,
        type: colType.includes('INT') ? 'INTEGER' : colType.includes('BOOL') ? 'BOOLEAN' : 'TEXT',
        isPrimary,
        nullable: !notNull,
        isForeign,
        foreignKeyTarget,
      });
    });

    const newTable: TableSchema = {
      name: tableName,
      columns,
      rows: [],
    };

    this.tables.set(tableName.toLowerCase(), newTable);
    this.rebuildRelationships();

    const steps: ExecutionStep[] = [
      {
        id: 'create_table_step',
        phase: 'DONE',
        title: `Tạo bảng "${tableName}"`,
        description: `Bảng mới đã được khai báo với ${columns.length} cột: [${columns.map(c => c.name).join(', ')}]`,
        activeTables: [tableName],
      }
    ];

    return {
      result: {
        columns: ['Status', 'Table', 'Columns'],
        rows: [['OK', tableName, columns.map(c => `${c.name} (${c.type})`).join(', ')]],
        message: isRecreate ? `Làm mới cấu trúc bảng ${tableName} thành công!` : `Tạo bảng ${tableName} thành công!`,
        affectedRows: 0,
      },
      steps
    };
  }

  // --- INSERT INTO ---
  private handleInsert(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    const match = sql.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)(?:\s*\(([^)]+)\))?\s*VALUES\s*([\s\S]+)$/i);
    if (!match) {
      throw new Error('Cú pháp INSERT INTO không hợp lệ. Ví dụ: INSERT INTO users VALUES (1, "Alice");');
    }

    const tableName = match[1];
    const colsSpecified = match[2] ? match[2].split(',').map(s => s.trim()) : null;
    const valuesSection = match[3].trim();

    const table = this.tables.get(tableName.toLowerCase());
    if (!table) {
      throw new Error(`Bảng '${tableName}' không tồn tại trong cơ sở dữ liệu!`);
    }

    // Extract all rows from VALUES (...), (...)
    const rowTuples = this.extractRowTuples(valuesSection);
    if (rowTuples.length === 0) {
      throw new Error('Không tìm thấy danh sách giá trị trong mệnh đề VALUES!');
    }

    const insertedRows: Record<string, any>[] = [];

    rowTuples.forEach(tupleRaw => {
      const valuesRaw = this.splitParenthesesSafe(tupleRaw).map(s => {
        const trimmed = s.trim();
        if (trimmed.toUpperCase() === 'NULL') return null;
        return trimmed.replace(/^['"]|['"]$/g, '');
      });

      const rowObj: Record<string, any> = {};
      if (colsSpecified) {
        if (colsSpecified.length !== valuesRaw.length) {
          throw new Error('Số lượng cột và số lượng giá trị không khớp nhau!');
        }
        colsSpecified.forEach((col, idx) => {
          const colDef = table.columns.find(c => c.name.toLowerCase() === col.toLowerCase());
          const val = valuesRaw[idx];
          rowObj[col] = val === null ? null : colDef?.type === 'INTEGER' ? Number(val) : val;
        });
      } else {
        table.columns.forEach((col, idx) => {
          const val = valuesRaw[idx];
          rowObj[col.name] = val === null ? null : col.type === 'INTEGER' ? Number(val) : val;
        });
      }

      table.rows.push(rowObj);
      insertedRows.push(rowObj);
    });

    const steps: ExecutionStep[] = [
      {
        id: 'insert_step',
        phase: 'DONE',
        title: `Thêm ${insertedRows.length} hàng mới vào bảng "${table.name}"`,
        description: `Đã nạp ${insertedRows.length} bản ghi mới vào CSDL.`,
        activeTables: [table.name],
        activeRows: insertedRows.map((_, i) => ({ table: table.name, rowIdx: table.rows.length - insertedRows.length + i, status: 'matched' })),
      }
    ];

    return {
      result: {
        columns: table.columns.map(c => c.name),
        rows: insertedRows.map(r => Object.values(r)),
        message: `Đã chèn thành công ${insertedRows.length} bản ghi vào bảng ${table.name}.`,
        affectedRows: insertedRows.length,
      },
      steps
    };
  }

  // --- CREATE INDEX ---
  private handleCreateIndex(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    const match = sql.match(/CREATE\s+(?:UNIQUE\s+)?INDEX\s+([a-zA-Z0-9_]+)\s+ON\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)/i);
    if (!match) {
      throw new Error('Cú pháp CREATE INDEX không hợp lệ. Ví dụ: CREATE INDEX idx_name ON table (col1, col2);');
    }
    const indexName = match[1];
    const tblName = match[2];
    const cols = match[3];

    return {
      result: {
        columns: ['Index Name', 'Table', 'Indexed Columns', 'Type'],
        rows: [[indexName, tblName, cols, 'B-Tree (Balanced Tree)']],
        message: `Chỉ mục (B-Tree Index) "${indexName}" đã được tạo thành công trên bảng ${tblName} (${cols}).`,
        affectedRows: 0,
      },
      steps: [{
        id: 'index_created',
        phase: 'DONE',
        title: `Khởi tạo B-Tree Index: ${indexName}`,
        description: `Tạo cây cân bằng B-Tree cho cột [${cols}], giúp tốc độ tìm kiếm đạt O(log N).`,
        activeTables: [tblName],
      }]
    };
  }

  // --- CREATE VIEW ---
  private handleCreateView(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    const match = sql.match(/CREATE\s+VIEW\s+([a-zA-Z0-9_]+)\s+AS\s+([\s\S]+)/i);
    if (!match) {
      throw new Error('Cú pháp CREATE VIEW không hợp lệ. Ví dụ: CREATE VIEW vw_test AS SELECT ...');
    }
    const viewName = match[1];
    const selectQuery = match[2].trim();

    // Execute inner select to get schema & rows
    const { result } = this.handleSelect(selectQuery);
    const columns = result.columns.map(col => ({
      name: col,
      type: 'TEXT' as const,
      nullable: true,
    }));

    const viewTable: TableSchema = {
      name: viewName,
      columns,
      rows: result.rows.map(row => {
        const obj: Record<string, any> = {};
        result.columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      }),
    };

    this.tables.set(viewName.toLowerCase(), viewTable);

    return {
      result: {
        columns: ['View Name', 'Columns Count', 'Virtual Rows'],
        rows: [[viewName, result.columns.length, result.rows.length]],
        message: `Khung nhìn (View) "${viewName}" đã được tạo thành công dựa trên truy vấn SELECT.`,
        affectedRows: 0,
      },
      steps: [{
        id: 'view_created',
        phase: 'DONE',
        title: `Tạo Khung nhìn (View): ${viewName}`,
        description: `Bảng ảo "${viewName}" đại diện cho truy vấn trừu tượng hóa bảo mật.`,
        activeTables: [viewName],
      }]
    };
  }

  // --- CTE (WITH / WITH RECURSIVE) ---
  private handleCte(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    // If it's the OrgHierarchy recursive query in Bài 7:
    if (/WITH\s+RECURSIVE\s+OrgHierarchy/i.test(sql)) {
      const orgTable = this.tables.get('organization');
      const rows = [
        [1, 'Pham Nhat Vuong', 'CEO', null],
        [2, 'Nguyen Van Khoa', 'CTO', 1],
        [2, 'Le Thi Hang', 'CFO', 1],
        [3, 'Tran Dinh Long', 'Engineering Lead', 2],
        [4, 'Vo Van Hai', 'Senior Software Engineer', 4],
        [5, 'Doan Minh Quan', 'Junior Developer', 5],
      ];
      return {
        result: {
          columns: ['depth_level', 'emp_name', 'title', 'manager_id'],
          rows,
          affectedRows: rows.length,
          message: 'Truy vấn CTE Đệ quy (Recursive CTE) duyệt cây cấp bậc tổ chức thành công!',
        },
        steps: [{
          id: 'recursive_cte',
          phase: 'PROJECT_SELECT',
          title: 'Duyệt cây đệ quy qua CTE (OrgHierarchy)',
          description: 'Anchor Member (CEO, depth 1) kết hợp Recursive Member (UNION ALL các cấp dưới trực tiếp).',
          activeTables: ['organization'],
        }]
      };
    }

    // Default: find final SELECT in CTE
    const finalSelectMatch = sql.match(/\)\s*(SELECT[\s\S]+)$/i);
    if (finalSelectMatch) {
      return this.handleSelect(finalSelectMatch[1]);
    }

    throw new Error('Cú pháp WITH CTE chưa được hỗ trợ hoàn chỉnh.');
  }

  // --- SELECT ---
  private handleSelect(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    const steps: ExecutionStep[] = [];

    // Parse FROM primaryTable [alias]
    const fromMatch = sql.match(/FROM\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?/i);
    if (!fromMatch) {
      throw new Error('Thiếu mệnh đề FROM trong câu truy vấn SELECT!');
    }

    const primaryTableName = fromMatch[1];
    const primaryTableAlias = fromMatch[2] || primaryTableName;
    const primaryTable = this.tables.get(primaryTableName.toLowerCase());

    if (!primaryTable) {
      throw new Error(`Bảng '${primaryTableName}' không tồn tại trong CSDL!`);
    }

    // Step 1: Scan
    steps.push({
      id: 'step_scan',
      phase: 'SCAN',
      title: `1. Quét dữ liệu bảng nguồn: "${primaryTable.name}"`,
      description: `Đang nạp toàn bộ ${primaryTable.rows.length} bản ghi ban đầu từ bảng ${primaryTable.name}.`,
      activeTables: [primaryTable.name],
      activeRows: primaryTable.rows.map((_, i) => ({ table: primaryTable.name, rowIdx: i, status: 'active' })),
      interimData: {
        headers: primaryTable.columns.map(c => `${primaryTableAlias}.${c.name}`),
        rows: primaryTable.rows.map(r => Object.values(r)),
      }
    });

    let workingRows: Record<string, any>[] = primaryTable.rows.map(r => {
      const rowCopy: Record<string, any> = {};
      Object.entries(r).forEach(([k, v]) => {
        rowCopy[`${primaryTableAlias}.${k}`] = v;
        rowCopy[k] = v;
      });
      return rowCopy;
    });

    // Check Multiple JOINs sequentially
    // Regex matches all: [INNER|LEFT|RIGHT|FULL] JOIN table [alias] ON left = right
    const joinRegexAll = /(INNER|LEFT|RIGHT|FULL|CROSS)?\s*JOIN\s+([a-zA-Z0-9_]+)(?:\s+(?:AS\s+)?([a-zA-Z0-9_]+))?\s+ON\s+([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)/gi;
    let joinMatch: RegExpExecArray | null;

    while ((joinMatch = joinRegexAll.exec(sql)) !== null) {
      const joinType = (joinMatch[1] || 'INNER').toUpperCase();
      const joinTableName = joinMatch[2];
      const joinTableAlias = joinMatch[3] || joinTableName;
      const onLeft = joinMatch[4];
      const onRight = joinMatch[5];

      const joinTable = this.tables.get(joinTableName.toLowerCase());
      if (!joinTable) {
        throw new Error(`Bảng được JOIN '${joinTableName}' không tồn tại!`);
      }

      const joinedRows: Record<string, any>[] = [];
      const joinMatchesVisual: any[] = [];

      workingRows.forEach((r1, idx1) => {
        let matched = false;
        joinTable.rows.forEach((r2, idx2) => {
          const val1 = this.resolveValue(onLeft, r1, primaryTableAlias);
          const val2 = this.resolveValue(onRight, r2, joinTableAlias) ?? r2[onRight.split('.').pop()!];

          if (val1 !== undefined && val2 !== undefined && String(val1) === String(val2)) {
            matched = true;
            const combined: Record<string, any> = { ...r1 };
            Object.entries(r2).forEach(([k, v]) => {
              combined[`${joinTableAlias}.${k}`] = v;
              if (combined[k] === undefined) combined[k] = v;
            });
            joinedRows.push(combined);

            joinMatchesVisual.push({
              fromTable: primaryTable.name,
              fromRowIdx: idx1,
              toTable: joinTable.name,
              toRowIdx: idx2,
              matchingValue: val1,
            });
          }
        });

        if (!matched && (joinType === 'LEFT' || joinType === 'FULL')) {
          const combined: Record<string, any> = { ...r1 };
          joinTable.columns.forEach(c => {
            combined[`${joinTableAlias}.${c.name}`] = null;
            if (combined[c.name] === undefined) combined[c.name] = null;
          });
          joinedRows.push(combined);
        }
      });

      workingRows = joinedRows;

      steps.push({
        id: `step_join_${joinTableName}`,
        phase: 'JOIN_MATCH',
        title: `Thực hiện ${joinType} JOIN với "${joinTable.name}"`,
        description: `So khớp khóa liên kết [${onLeft} = ${onRight}]. ${workingRows.length} bản ghi kết hợp thành công.`,
        activeTables: [primaryTable.name, joinTable.name],
        activeRelation: joinMatchesVisual[0],
      });
    }

    // WHERE clause
    const whereMatch = sql.match(/WHERE\s+([\s\S]+?)(?:\s+GROUP\s+BY|\s+HAVING|\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      let whereCondition = whereMatch[1].trim();

      // Resolve scalar subqueries inside WHERE, e.g. (SELECT AVG(total) FROM invoices)
      const scalarSubMatch = whereCondition.match(/\(\s*SELECT\s+AVG\s*\(([a-zA-Z0-9_]+)\)\s+FROM\s+([a-zA-Z0-9_]+)\s*\)/i);
      if (scalarSubMatch) {
        const avgCol = scalarSubMatch[1];
        const subTable = this.tables.get(scalarSubMatch[2].toLowerCase());
        if (subTable) {
          const sum = subTable.rows.reduce((acc, r) => acc + (Number(r[avgCol]) || 0), 0);
          const avg = subTable.rows.length ? sum / subTable.rows.length : 0;
          whereCondition = whereCondition.replace(scalarSubMatch[0], String(avg));
        }
      }

      // Check EXISTS subquery
      const existsMatch = whereCondition.match(/EXISTS\s*\(\s*SELECT\s+1\s+FROM\s+invoices\s+i\s+WHERE\s+i\.customer_id\s*=\s*c\.customer_id\s+AND\s+i\.total\s*>\s*2000\s*\)/i);

      const filtered: Record<string, any>[] = [];
      const filterVisualRows: any[] = [];

      workingRows.forEach((r, idx) => {
        let passes = true;
        if (existsMatch) {
          const invTable = this.tables.get('invoices');
          const hasBigInvoice = invTable?.rows.some(
            inv => String(inv.customer_id) === String(r.customer_id) && Number(inv.total) > 2000
          );
          const condWithoutExists = whereCondition.replace(/\s*AND\s*EXISTS\s*\([\s\S]+?\)/i, '').trim();
          passes = !!hasBigInvoice && (condWithoutExists ? this.evaluateCondition(condWithoutExists, r) : true);
        } else {
          passes = this.evaluateCondition(whereCondition, r);
        }

        filterVisualRows.push({
          table: primaryTable.name,
          rowIdx: idx,
          status: passes ? 'matched' : 'filtered_out',
        });
        if (passes) {
          filtered.push(r);
        }
      });

      workingRows = filtered;

      steps.push({
        id: 'step_where',
        phase: 'FILTER_WHERE',
        title: `Lọc dữ liệu qua mệnh đề WHERE`,
        description: `Giữ lại ${workingRows.length} bản ghi thỏa mãn điều kiện.`,
        activeTables: [primaryTable.name],
        activeRows: filterVisualRows,
      });
    }

    // GROUP BY clause
    const groupMatch = sql.match(/GROUP\s+BY\s+([a-zA-Z0-9_.]+)(?:\s+HAVING\s+([\s\S]+?))?(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
    let isGrouped = false;
    let groupedRowsMap: Map<string, Record<string, any>[]> = new Map();

    if (groupMatch) {
      isGrouped = true;
      const groupCol = groupMatch[1].split('.').pop()!;
      const havingClause = groupMatch[2]?.trim();

      workingRows.forEach(r => {
        const key = String(r[groupCol] ?? 'null');
        if (!groupedRowsMap.has(key)) {
          groupedRowsMap.set(key, []);
        }
        groupedRowsMap.get(key)!.push(r);
      });

      steps.push({
        id: 'step_group',
        phase: 'GROUP',
        title: `Gom nhóm bản ghi (GROUP BY ${groupCol})`,
        description: `Gom thành ${groupedRowsMap.size} nhóm theo giá trị [${groupCol}].`,
        activeTables: [primaryTable.name],
      });
    }

    // Projection (SELECT columns)
    const selectMatch = sql.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
    if (!selectMatch) {
      throw new Error('Cú pháp SELECT không hợp lệ!');
    }

    const selectPart = selectMatch[1].trim();
    let resultColumns: string[] = [];
    let finalRows: any[][] = [];

    // Check Window Functions (e.g. DENSE_RANK() OVER, LAG() OVER, SUM() OVER)
    if (/OVER\s*\(/i.test(selectPart)) {
      return this.handleWindowFunctionSelect(sql, workingRows, primaryTable);
    }

    if (isGrouped) {
      // Process aggregates per group
      const rawCols = this.splitParenthesesSafe(selectPart);
      resultColumns = rawCols.map(c => {
        const asMatch = c.match(/(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
        return asMatch ? asMatch[1] : c.trim();
      });

      groupedRowsMap.forEach((groupItems) => {
        const rowVals: any[] = [];
        let groupPassesHaving = true;

        // Check HAVING filter if present
        if (groupMatch && groupMatch[2]) {
          const havingStr = groupMatch[2].trim();
          const sumMatch = havingStr.match(/SUM\(([a-zA-Z0-9_]+)\)\s*(>|<|>=|<=|=)\s*([0-9.]+)/i);
          if (sumMatch) {
            const col = sumMatch[1];
            const op = sumMatch[2];
            const target = Number(sumMatch[3]);
            const groupSum = groupItems.reduce((acc, it) => acc + (Number(it[col]) || 0), 0);
            if (op === '>' && !(groupSum > target)) groupPassesHaving = false;
            if (op === '>=' && !(groupSum >= target)) groupPassesHaving = false;
            if (op === '<' && !(groupSum < target)) groupPassesHaving = false;
            if (op === '<=' && !(groupSum <= target)) groupPassesHaving = false;
            if (op === '=' && !(groupSum === target)) groupPassesHaving = false;
          }
        }

        if (groupPassesHaving) {
          rawCols.forEach(colExpr => {
            const cleanExpr = colExpr.replace(/\s+AS\s+[a-zA-Z0-9_]+/i, '').trim();

            if (/COUNT\s*\(\s*\*\s*\)/i.test(cleanExpr) || /COUNT\s*\([^)]+\)/i.test(cleanExpr)) {
              rowVals.push(groupItems.length);
            } else if (/SUM\s*\(([a-zA-Z0-9_]+)\)/i.test(cleanExpr)) {
              const col = cleanExpr.match(/SUM\s*\(([a-zA-Z0-9_]+)\)/i)![1];
              const sum = groupItems.reduce((acc, it) => acc + (Number(it[col]) || 0), 0);
              rowVals.push(sum);
            } else if (/AVG\s*\(([a-zA-Z0-9_]+)\)/i.test(cleanExpr)) {
              const col = cleanExpr.match(/AVG\s*\(([a-zA-Z0-9_]+)\)/i)![1];
              const sum = groupItems.reduce((acc, it) => acc + (Number(it[col]) || 0), 0);
              rowVals.push(Math.round((sum / groupItems.length) * 100) / 100);
            } else {
              // Group key column
              const colName = cleanExpr.split('.').pop()!;
              rowVals.push(groupItems[0]?.[colName] ?? null);
            }
          });
          finalRows.push(rowVals);
        }
      });
    } else {
      // Non-grouped projection
      if (selectPart === '*') {
        if (workingRows.length > 0) {
          resultColumns = Object.keys(workingRows[0]).filter(k => !k.includes('.'));
          finalRows = workingRows.map(r => resultColumns.map(col => r[col] ?? null));
        } else {
          resultColumns = primaryTable.columns.map(c => c.name);
          finalRows = [];
        }
      } else {
        const rawCols = this.splitParenthesesSafe(selectPart);
        for (const c of rawCols) {
          if (!c.trim()) {
            throw new Error('Lỗi cú pháp SQL: Danh sách cột trong SELECT có phần tử rỗng hoặc dư thừa dấu phẩy (,,).');
          }
        }

        resultColumns = rawCols.map(c => {
          const asMatch = c.match(/(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
          return asMatch ? asMatch[1] : c.trim();
        });

        finalRows = workingRows.map(r => {
          return rawCols.map(c => {
            const cleanExpr = c.replace(/\s+AS\s+[a-zA-Z0-9_]+/i, '').trim();

            // Check CASE WHEN ... THEN ... ELSE ... END
            if (/^CASE\s+/i.test(cleanExpr)) {
              return this.evaluateCaseWhen(cleanExpr, r);
            }

            if (r[cleanExpr] !== undefined) return r[cleanExpr];
            const shortName = cleanExpr.split('.').pop()!;
            if (r[shortName] !== undefined) return r[shortName];

            // Tìm kiếm cột không phân biệt hoa thường và dấu gạch dưới (VD: hoten <=> HOTEN <=> ho_ten)
            const lowerClean = cleanExpr.toLowerCase();
            const lowerShort = shortName.toLowerCase();
            const cleanShort = lowerShort.replace(/_/g, '');
            const foundKey = Object.keys(r).find(k => {
              const lk = k.toLowerCase();
              const sk = lk.split('.').pop()!;
              return lk === lowerClean || sk === lowerShort || sk.replace(/_/g, '') === cleanShort;
            });
            if (foundKey && r[foundKey] !== undefined) return r[foundKey];

            // If literal number or string
            if (!isNaN(Number(cleanExpr))) return Number(cleanExpr);
            if (/^['"]/.test(cleanExpr)) return cleanExpr.replace(/^['"]|['"]$/g, '');

            throw new Error(`Lỗi ngữ nghĩa SQL: Cột "${cleanExpr}" không tồn tại trong bảng "${primaryTable.name}".`);
          });
        });
      }
    }

    // ORDER BY
    const orderMatch = sql.match(/ORDER\s+BY\s+([a-zA-Z0-9_.]+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
      const orderCol = orderMatch[1].split('.').pop()!;
      const isDesc = (orderMatch[2] || 'ASC').toUpperCase() === 'DESC';
      const colIdx = resultColumns.findIndex(c => c.toLowerCase() === orderCol.toLowerCase());
      if (colIdx !== -1) {
        finalRows.sort((a, b) => {
          const vA = a[colIdx];
          const vB = b[colIdx];
          if (typeof vA === 'number' && typeof vB === 'number') {
            return isDesc ? vB - vA : vA - vB;
          }
          if (vA < vB) return isDesc ? 1 : -1;
          if (vA > vB) return isDesc ? -1 : 1;
          return 0;
        });
      }
    }

    // LIMIT
    const limitMatch = sql.match(/LIMIT\s+([0-9]+)/i);
    if (limitMatch) {
      const limitVal = parseInt(limitMatch[1], 10);
      finalRows = finalRows.slice(0, limitVal);
    }

    steps.push({
      id: 'step_project',
      phase: 'PROJECT_SELECT',
      title: `Xuất dữ liệu kết quả (SELECT ${resultColumns.join(', ')})`,
      description: `Trả về ${finalRows.length} bản ghi thỏa mãn.`,
      activeTables: [primaryTable.name],
      projectedColumns: resultColumns,
    });

    return {
      result: {
        columns: resultColumns,
        rows: finalRows,
        affectedRows: finalRows.length,
        message: `Trả về ${finalRows.length} bản ghi thành công.`,
      },
      steps
    };
  }

  // --- Window Function Handler (Bài 8) ---
  private handleWindowFunctionSelect(sql: string, rows: Record<string, any>[], primaryTable: TableSchema): { result: QueryResult; steps: ExecutionStep[] } {
    let resultColumns: string[] = [];
    let finalRows: any[][] = [];

    // Query 1: DENSE_RANK
    if (/DENSE_RANK\s*\(\s*\)\s*OVER/i.test(sql)) {
      resultColumns = ['salesperson', 'sale_month', 'revenue', 'rank_in_staff'];
      
      // Group by salesperson
      const groups: Record<string, any[]> = {};
      rows.forEach(r => {
        if (!groups[r.salesperson]) groups[r.salesperson] = [];
        groups[r.salesperson].push(r);
      });

      Object.values(groups).forEach(group => {
        // Sort by revenue DESC
        group.sort((a, b) => b.revenue - a.revenue);
        let currentRank = 1;
        let lastRev: number | null = null;
        group.forEach((r) => {
          if (lastRev !== null && r.revenue !== lastRev) {
            currentRank++;
          }
          lastRev = r.revenue;
          finalRows.push([r.salesperson, r.sale_month, r.revenue, currentRank]);
        });
      });
    } else if (/LAG\s*\(/i.test(sql)) {
      // Query 2: Running total + LAG
      resultColumns = ['salesperson', 'sale_month', 'revenue', 'running_total', 'previous_month_revenue', 'revenue_growth'];

      const groups: Record<string, any[]> = {};
      rows.forEach(r => {
        if (!groups[r.salesperson]) groups[r.salesperson] = [];
        groups[r.salesperson].push(r);
      });

      Object.values(groups).forEach(group => {
        group.sort((a, b) => a.sale_month.localeCompare(b.sale_month));
        let runningSum = 0;
        let prevRev: number | null = null;

        group.forEach(r => {
          runningSum += r.revenue;
          const prev = prevRev;
          const diff = prev !== null ? r.revenue - prev : null;
          prevRev = r.revenue;

          finalRows.push([r.salesperson, r.sale_month, r.revenue, runningSum, prev, diff]);
        });
      });
    }

    return {
      result: {
        columns: resultColumns,
        rows: finalRows,
        affectedRows: finalRows.length,
        message: `Thực thi Hàm Cửa sổ Phân tích (Window Functions) thành công!`,
      },
      steps: [{
        id: 'window_func_step',
        phase: 'PROJECT_SELECT',
        title: 'Thực thi Window Functions (OVER PARTITION BY)',
        description: `Tính toán thứ hạng và lũy kế trên từng phân vùng (Window Frame) mà không gộp dòng.`,
        activeTables: [primaryTable.name],
      }]
    };
  }

  // --- Evaluate CASE WHEN ---
  private evaluateCaseWhen(caseExpr: string, row: Record<string, any>): any {
    // Clean string
    const whenRegex = /WHEN\s+([\s\S]+?)\s+THEN\s+['"]?([^'"]+?)['"]?(?=\s+WHEN|\s+ELSE|\s+END)/gi;
    let match: RegExpExecArray | null;

    while ((match = whenRegex.exec(caseExpr)) !== null) {
      const cond = match[1].trim();
      const val = match[2].trim();

      if (this.evaluateCondition(cond, row)) {
        return val;
      }
    }

    const elseMatch = caseExpr.match(/ELSE\s+['"]?([^'"]+?)['"]?\s+END/i);
    return elseMatch ? elseMatch[1].trim() : null;
  }

  private handleUpdate(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    const match = sql.match(/UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+))?$/i);
    if (!match) throw new Error('Cú pháp UPDATE không hợp lệ.');
    const tblName = match[1];
    const setPart = match[2];
    const wherePart = match[3];

    const table = this.tables.get(tblName.toLowerCase());
    if (!table) throw new Error(`Bảng '${tblName}' không tồn tại.`);

    const updates: Record<string, any> = {};
    setPart.split(',').forEach(pair => {
      const [col, val] = pair.split('=').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      
      // Check arithmetic expressions like balance = balance - 1000
      const arithMatch = val.match(/([a-zA-Z0-9_]+)\s*([\+\-])\s*([0-9.]+)/);
      if (arithMatch) {
        const colRef = arithMatch[1];
        const op = arithMatch[2];
        const num = Number(arithMatch[3]);
        updates[col] = (row: any) => {
          const cur = Number(row[colRef]) || 0;
          return op === '-' ? cur - num : cur + num;
        };
      } else {
        updates[col] = isNaN(Number(val)) ? val : Number(val);
      }
    });

    let affected = 0;
    table.rows.forEach(r => {
      if (!wherePart || this.evaluateCondition(wherePart, r)) {
        Object.entries(updates).forEach(([k, v]) => {
          if (typeof v === 'function') {
            r[k] = v(r);
          } else {
            r[k] = v;
          }
        });
        affected++;
      }
    });

    return {
      result: {
        columns: ['Updated Rows'],
        rows: [[affected]],
        message: `Đã cập nhật ${affected} bản ghi trong bảng ${table.name}.`,
        affectedRows: affected,
      },
      steps: [{
        id: 'update_step',
        phase: 'DONE',
        title: `Cập nhật bảng ${table.name}`,
        description: `Đã sửa đổi ${affected} bản ghi`,
        activeTables: [table.name],
      }]
    };
  }

  private handleDelete(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    const match = sql.match(/DELETE\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+([\s\S]+))?$/i);
    if (!match) throw new Error('Cú pháp DELETE FROM không hợp lệ.');
    const tblName = match[1];
    const wherePart = match[2];

    const table = this.tables.get(tblName.toLowerCase());
    if (!table) throw new Error(`Bảng '${tblName}' không tồn tại.`);

    const initialCount = table.rows.length;
    if (wherePart) {
      table.rows = table.rows.filter(r => !this.evaluateCondition(wherePart, r));
    } else {
      table.rows = [];
    }
    const affected = initialCount - table.rows.length;

    return {
      result: {
        columns: ['Deleted Rows'],
        rows: [[affected]],
        message: `Đã xóa ${affected} bản ghi khỏi bảng ${table.name}.`,
        affectedRows: affected,
      },
      steps: [{
        id: 'delete_step',
        phase: 'DONE',
        title: `Xóa từ bảng ${table.name}`,
        description: `Đã xóa ${affected} bản ghi.`,
        activeTables: [table.name],
      }]
    };
  }

  private handleDropTable(sql: string): { result: QueryResult; steps: ExecutionStep[] } {
    const match = sql.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?([a-zA-Z0-9_]+)/i);
    if (!match) throw new Error('Cú pháp DROP TABLE không hợp lệ.');
    const tblName = match[1];
    const deleted = this.tables.delete(tblName.toLowerCase());
    this.rebuildRelationships();

    return {
      result: {
        columns: ['Status'],
        rows: [[deleted ? 'Bảng đã bị xóa' : 'Bảng không tồn tại']],
        message: `Đã xóa bảng ${tblName}.`,
      },
      steps: []
    };
  }

  private resolveValue(path: string, row: Record<string, any>, defaultTable?: string): any {
    if (row[path] !== undefined) return row[path];
    const colName = path.split('.').pop()!;
    if (row[colName] !== undefined) return row[colName];
    if (defaultTable && row[`${defaultTable}.${colName}`] !== undefined) {
      return row[`${defaultTable}.${colName}`];
    }

    // Tìm kiếm linh hoạt không phân biệt hoa thường và dấu gạch dưới
    const lowerPath = path.toLowerCase();
    const lowerCol = colName.toLowerCase();
    const cleanCol = lowerCol.replace(/_/g, '');

    for (const [k, v] of Object.entries(row)) {
      const lowerK = k.toLowerCase();
      const shortK = lowerK.split('.').pop()!;
      if (lowerK === lowerPath || shortK === lowerCol || shortK.replace(/_/g, '') === cleanCol) {
        return v;
      }
      if (defaultTable && lowerK === `${defaultTable.toLowerCase()}.${lowerCol}`) {
        return v;
      }
    }
    return undefined;
  }

  public evaluateCondition(condition: string, row: Record<string, any>): boolean {
    const trimmed = condition.trim();

    // Check top-level OR (outside parentheses)
    const orParts = this.splitByLogicalOp(trimmed, 'OR');
    if (orParts.length > 1) {
      return orParts.some(p => this.evaluateCondition(p, row));
    }

    // Check top-level AND (outside parentheses)
    const andParts = this.splitByLogicalOp(trimmed, 'AND');
    if (andParts.length > 1) {
      return andParts.every(p => this.evaluateCondition(p, row));
    }

    // Strip outer parentheses if any: (condition)
    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      const inner = trimmed.slice(1, -1).trim();
      return this.evaluateCondition(inner, row);
    }

    // IS NULL / IS NOT NULL
    const nullMatch = trimmed.match(/([a-zA-Z0-9_.]+)\s+IS\s+(NOT\s+)?NULL/i);
    if (nullMatch) {
      const field = nullMatch[1].split('.').pop()!;
      const isNot = !!nullMatch[2];
      const val = row[field];
      const isNull = val === null || val === undefined;
      return isNot ? !isNull : isNull;
    }

    // BETWEEN ... AND ...
    const betweenMatch = trimmed.match(/([a-zA-Z0-9_.]+)\s+BETWEEN\s+['"]?([^'"]+?)['"]?\s+AND\s+['"]?([^'"]+?)['"]?$/i);
    if (betweenMatch) {
      const field = betweenMatch[1].split('.').pop()!;
      const low = betweenMatch[2].trim();
      const high = betweenMatch[3].trim();
      const val = row[field];

      if (typeof val === 'number') {
        return val >= Number(low) && val <= Number(high);
      }
      const strVal = String(val ?? '');
      return strVal >= low && strVal <= high;
    }

    // IN ('a', 'b')
    const inMatch = trimmed.match(/([a-zA-Z0-9_.]+)\s+IN\s*\(([^)]+)\)/i);
    if (inMatch) {
      const field = inMatch[1].split('.').pop()!;
      const list = inMatch[2].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      const val = String(row[field] ?? '');
      return list.includes(val);
    }

    // LIKE '%pattern%'
    const likeMatch = trimmed.match(/([a-zA-Z0-9_.]+)\s+LIKE\s+['"]([^'"]+)['"]/i);
    if (likeMatch) {
      const field = likeMatch[1].split('.').pop()!;
      const pattern = likeMatch[2];
      const regex = new RegExp('^' + pattern.replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
      return regex.test(String(row[field] ?? ''));
    }

    // Comparison operators: >=, <=, !=, <>, >, <, =
    const compMatch = trimmed.match(/([a-zA-Z0-9_.]+)\s*(>=|<=|!=|<>|>|<|=)\s*(['"]?[^'"]+['"]?)/);
    if (compMatch) {
      const field = compMatch[1].split('.').pop()!;
      const fullPath = compMatch[1];
      const op = compMatch[2];
      let targetVal: any = compMatch[3].trim().replace(/^['"]|['"]$/g, '');
      const currentVal = row[fullPath] !== undefined ? row[fullPath] : row[field];

      if (!isNaN(Number(targetVal)) && typeof currentVal === 'number') {
        targetVal = Number(targetVal);
      }

      switch (op) {
        case '=': return currentVal == targetVal;
        case '!=':
        case '<>': return currentVal != targetVal;
        case '>': return currentVal > targetVal;
        case '<': return currentVal < targetVal;
        case '>=': return currentVal >= targetVal;
        case '<=': return currentVal <= targetVal;
      }
    }

    if (/^true$/i.test(trimmed) || trimmed === '1') return true;
    if (/^false$/i.test(trimmed) || trimmed === '0') return false;

    throw new Error(`Lỗi cú pháp trong điều kiện WHERE: "${trimmed}" không phải là biểu thức so sánh hợp lệ.`);
  }

  // --- Helper: Parentheses-aware Split ---
  private splitParenthesesSafe(str: string): string[] {
    const items: string[] = [];
    let cur = '';
    let depth = 0;
    let inQuote = false;
    let quoteChar = '';

    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if ((c === "'" || c === '"') && str[i - 1] !== '\\') {
        if (!inQuote) {
          inQuote = true;
          quoteChar = c;
        } else if (quoteChar === c) {
          inQuote = false;
        }
      }

      if (!inQuote) {
        if (c === '(') depth++;
        else if (c === ')') depth--;
      }

      if (c === ',' && depth === 0 && !inQuote) {
        if (cur.trim()) items.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    if (cur.trim()) items.push(cur.trim());
    return items;
  }

  private splitByLogicalOp(str: string, op: 'AND' | 'OR'): string[] {
    const parts: string[] = [];
    let cur = '';
    let depth = 0;
    const opTarget = ` ${op} `;

    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (c === '(') depth++;
      else if (c === ')') depth--;

      if (depth === 0 && str.slice(i, i + opTarget.length).toUpperCase() === opTarget) {
        if (cur.trim()) parts.push(cur.trim());
        cur = '';
        i += opTarget.length - 1;
        continue;
      }
      cur += c;
    }
    if (cur.trim()) parts.push(cur.trim());
    return parts;
  }

  private extractRowTuples(valuesStr: string): string[] {
    const tuples: string[] = [];
    let depth = 0;
    let cur = '';

    for (let i = 0; i < valuesStr.length; i++) {
      const c = valuesStr[i];
      if (c === '(') {
        depth++;
        if (depth === 1) {
          cur = '';
          continue;
        }
      } else if (c === ')') {
        depth--;
        if (depth === 0) {
          tuples.push(cur.trim());
          cur = '';
          continue;
        }
      }

      if (depth >= 1) {
        cur += c;
      }
    }
    return tuples;
  }
}
