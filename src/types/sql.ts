export type DataType = 'INTEGER' | 'TEXT' | 'REAL' | 'BOOLEAN' | 'DATE' | 'VARCHAR';

export interface ColumnDefinition {
  name: string;
  type: DataType;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignKeyTarget?: {
    table: string;
    column: string;
  };
  nullable?: boolean;
  defaultValue?: any;
}

export interface TableRow {
  [columnName: string]: any;
}

export interface TableSchema {
  name: string;
  columns: ColumnDefinition[];
  rows: TableRow[];
}

export interface Relationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: '1:1' | '1:N' | 'N:M';
  description?: string;
}

export interface QueryResult {
  columns: string[];
  rows: any[][];
  error?: string;
  executionTimeMs?: number;
  message?: string;
  affectedRows?: number;
}

export interface ExecutionStep {
  id: string;
  phase: 'SCAN' | 'JOIN_MATCH' | 'FILTER_WHERE' | 'GROUP' | 'PROJECT_SELECT' | 'DONE';
  title: string;
  description: string;
  activeTables: string[];
  activeRows?: { table: string; rowIdx: number; status: 'matched' | 'filtered_out' | 'active' }[];
  activeRelation?: {
    fromTable: string;
    fromRowIdx: number;
    toTable: string;
    toRowIdx: number;
    matchingValue: any;
  };
  projectedColumns?: string[];
  interimData?: {
    headers: string[];
    rows: any[][];
  };
}
