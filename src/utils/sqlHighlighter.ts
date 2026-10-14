import React from 'react';
import { EditorTheme } from '../types/theme';

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS',
  'ON', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'AS', 'AND', 'OR',
  'NOT', 'IN', 'IS', 'NULL', 'LIKE', 'BETWEEN', 'INSERT', 'INTO', 'VALUES',
  'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'PRIMARY',
  'KEY', 'FOREIGN', 'REFERENCES', 'DEFAULT', 'UNIQUE', 'CASCADE', 'DISTINCT',
  'EXISTS', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'DESC', 'ASC',
  'IF'
]);

const SQL_FUNCTIONS = new Set([
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND', 'COALESCE', 'CONCAT', 'LOWER', 'UPPER', 'NOW'
]);

const SQL_TYPES = new Set([
  'INTEGER', 'INT', 'TEXT', 'VARCHAR', 'REAL', 'BOOLEAN', 'DATE', 'DATETIME', 'NUMERIC'
]);

export interface HighlightedToken {
  type: 'keyword' | 'function' | 'type' | 'string' | 'number' | 'comment' | 'operator' | 'text';
  value: string;
}

export function tokenizeSql(sql: string): HighlightedToken[] {
  const tokens: HighlightedToken[] = [];
  const regex = /(--[^\n]*|\/\*[\s\S]*?\*\/|'[^']*'|"[^"]*"|\b\d+(?:\.\d+)?\b|[a-zA-Z_][a-zA-Z0-9_]*|[=<>!+\-*/%]+|[(),;.]|\s+)/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(sql)) !== null) {
    const text = match[0];
    
    // Comments
    if (text.startsWith('--') || text.startsWith('/*')) {
      tokens.push({ type: 'comment', value: text });
    }
    // Strings
    else if ((text.startsWith("'") && text.endsWith("'")) || (text.startsWith('"') && text.endsWith('"'))) {
      tokens.push({ type: 'string', value: text });
    }
    // Numbers
    else if (/^\d+(?:\.\d+)?$/.test(text)) {
      tokens.push({ type: 'number', value: text });
    }
    // Words
    else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(text)) {
      const upper = text.toUpperCase();
      if (SQL_KEYWORDS.has(upper)) {
        tokens.push({ type: 'keyword', value: text });
      } else if (SQL_FUNCTIONS.has(upper)) {
        tokens.push({ type: 'function', value: text });
      } else if (SQL_TYPES.has(upper)) {
        tokens.push({ type: 'type', value: text });
      } else {
        tokens.push({ type: 'text', value: text });
      }
    }
    // Operators
    else if (/^[=<>!+\-*/%]+$/.test(text)) {
      tokens.push({ type: 'operator', value: text });
    }
    // Whitespace / punctuation
    else {
      tokens.push({ type: 'text', value: text });
    }
  }

  return tokens;
}

export function renderHighlightedTokens(tokens: HighlightedToken[], theme: EditorTheme): React.ReactNode[] {
  return tokens.map((token, index) => {
    let color = theme.text;
    let fontWeight: 'bold' | 'normal' = 'normal';
    let fontStyle: 'italic' | 'normal' = 'normal';

    switch (token.type) {
      case 'keyword':
        color = theme.keyword;
        fontWeight = 'bold';
        break;
      case 'function':
        color = theme.function;
        fontWeight = 'bold';
        break;
      case 'type':
        color = theme.type;
        break;
      case 'string':
        color = theme.string;
        break;
      case 'number':
        color = theme.number;
        break;
      case 'comment':
        color = theme.comment;
        fontStyle = 'italic';
        break;
      case 'operator':
        color = theme.operator;
        break;
      default:
        color = theme.text;
    }

    return React.createElement(
      'span',
      {
        key: index,
        style: {
          color,
          fontWeight,
          fontStyle,
        },
      },
      token.value
    );
  });
}
