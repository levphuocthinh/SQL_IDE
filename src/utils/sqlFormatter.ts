/**
 * Professional SQL Formatter & Prettifier
 * - Preserves comments intact
 * - Capitalizes standard SQL keywords and aggregate functions
 * - Formats clauses onto new lines (SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, etc.)
 * - Cleans irregular blank lines and whitespace
 * - Indents nested conditions (AND, OR)
 */

const MAJOR_CLAUSES = [
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'FULL JOIN',
  'CROSS JOIN',
  'JOIN',
  'UNION ALL',
  'UNION',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
  'CREATE TABLE',
  'ALTER TABLE',
  'DROP TABLE',
];

const STANDALONE_KEYWORDS = [
  'AND',
  'OR',
  'AS',
  'ON',
  'IN',
  'IS NULL',
  'IS NOT NULL',
  'IS',
  'NOT',
  'NULL',
  'LIKE',
  'BETWEEN',
  'ASC',
  'DESC',
  'DISTINCT',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'PRIMARY KEY',
  'FOREIGN KEY',
  'REFERENCES',
  'DEFAULT',
  'CHECK',
  'UNIQUE',
  'CONSTRAINT',
  'CASCADE',
  'ALL',
  'EXISTS',
];

const FUNCTIONS = [
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
  'ROUND',
  'COALESCE',
  'CONCAT',
  'LOWER',
  'UPPER',
  'NOW',
  'DATE',
];

export function formatSql(rawSql: string): string {
  if (!rawSql || !rawSql.trim()) return rawSql;

  const rawLines = rawSql.split('\n');
  const processedSegments: string[] = [];
  let currentSqlBuffer: string[] = [];

  const flushSqlBuffer = () => {
    if (currentSqlBuffer.length === 0) return;
    const combined = currentSqlBuffer.join(' ').replace(/\s+/g, ' ').trim();
    if (combined) {
      processedSegments.push(formatSqlStatement(combined));
    }
    currentSqlBuffer = [];
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    // Preserve comments
    if (line.startsWith('--') || line.startsWith('/*')) {
      flushSqlBuffer();
      processedSegments.push(line);
      continue;
    }

    // Skip empty lines inside query so it formats cleanly
    if (!line) {
      continue;
    }

    currentSqlBuffer.push(line);
  }

  flushSqlBuffer();

  return processedSegments.join('\n');
}

/**
 * Format a single continuous SQL statement
 */
function formatSqlStatement(sql: string): string {
  let text = sql;

  // 1. Capitalize Functions: e.g. sum( -> SUM(
  FUNCTIONS.forEach((fn) => {
    const reg = new RegExp(`\\b${fn}\\s*\\(`, 'gi');
    text = text.replace(reg, `${fn}(`);
  });

  // 2. Capitalize Standalone keywords: e.g. as -> AS, and -> AND
  STANDALONE_KEYWORDS.forEach((kw) => {
    const reg = new RegExp(`\\b${kw.replace(/ /g, '\\s+')}\\b`, 'gi');
    text = text.replace(reg, kw);
  });

  // 3. Capitalize and add line breaks for major clauses
  MAJOR_CLAUSES.forEach((clause) => {
    const reg = new RegExp(`\\b${clause.replace(/ /g, '\\s+')}\\b`, 'gi');
    text = text.replace(reg, `\n${clause} `);
  });

  // 4. Clean up multiple spaces and empty lines
  const lines = text
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l.length > 0);

  // 5. Apply clean indentation
  const formattedLines: string[] = [];

  lines.forEach((line) => {
    const isMajor = MAJOR_CLAUSES.some((kw) => line.toUpperCase().startsWith(kw));

    if (isMajor) {
      formattedLines.push(line);
    } else {
      formattedLines.push(`  ${line}`);
    }
  });

  // 6. Format AND / OR conditions on their own lines within WHERE or HAVING clauses
  const finalResult: string[] = [];
  formattedLines.forEach((line) => {
    if ((line.startsWith('WHERE ') || line.startsWith('HAVING ')) && (line.includes(' AND ') || line.includes(' OR '))) {
      const parts = line.split(/\s+(AND|OR)\s+/);
      let currentClause = parts[0];
      finalResult.push(currentClause);
      for (let i = 1; i < parts.length; i += 2) {
        const op = parts[i];
        const cond = parts[i + 1] || '';
        finalResult.push(`   ${op} ${cond.trim()}`);
      }
    } else {
      finalResult.push(line);
    }
  });

  return finalResult.join('\n');
}
