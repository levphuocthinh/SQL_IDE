export type EditorThemeId = 'classic-light' | 'darcula' | 'github-dark' | 'one-dark' | 'dracula';

export interface EditorTheme {
  id: EditorThemeId;
  name: string;
  bg: string;
  gutterBg: string;
  gutterText: string;
  text: string;
  selection: string;
  cursor: string;
  keyword: string;
  string: string;
  number: string;
  comment: string;
  function: string;
  type: string;
  operator: string;
  badge: string;
}

export const EDITOR_THEMES: Record<EditorThemeId, EditorTheme> = {
  'classic-light': {
    id: 'classic-light',
    name: 'SQLMaster Light',
    bg: '#ffffff',
    gutterBg: '#ffffff',
    gutterText: '#64748b',
    text: '#0f172a',
    selection: 'rgba(59, 130, 246, 0.25)',
    cursor: '#0f172a',
    keyword: '#0000ff', // Blue keywords like in screenshot
    string: '#0284c7',  // Sky blue strings
    number: '#0f766e',  // Teal numbers
    comment: '#16a34a', // Green comments like in screenshot
    function: '#7c3aed',// Purple functions
    type: '#1e3a8a',    // Dark blue types
    operator: '#0f172a',
    badge: '#2563eb',
  },
  darcula: {

    id: 'darcula',
    name: 'IntelliJ Darcula',
    bg: '#2b2b2b',
    gutterBg: '#313335',
    gutterText: '#606366',
    text: '#a9b7c6',
    selection: 'rgba(33, 66, 131, 0.6)',
    cursor: '#bbbbbb',
    keyword: '#cc7832', // IntelliJ orange
    string: '#6a8759',  // IntelliJ olive green
    number: '#6897bb',  // IntelliJ soft blue
    comment: '#808080', // IntelliJ gray
    function: '#ffc66d',// IntelliJ yellow
    type: '#a9b7c6',
    operator: '#a9b7c6',
    badge: '#cc7832',
  },
  'github-dark': {
    id: 'github-dark',
    name: 'GitHub Dark',
    bg: '#0d1117',
    gutterBg: '#161b22',
    gutterText: '#484f58',
    text: '#c9d1d9',
    selection: 'rgba(56, 139, 253, 0.3)',
    cursor: '#58a6ff',
    keyword: '#ff7b72', // Coral red/pink
    string: '#a5d6ff',  // Sky blue
    number: '#79c0ff',  // Blue
    comment: '#8b949e', // Muted
    function: '#d2a8ff',// Purple
    type: '#ffa657',    // Orange
    operator: '#ff7b72',
    badge: '#58a6ff',
  },
  'one-dark': {
    id: 'one-dark',
    name: 'One Dark Pro',
    bg: '#282c34',
    gutterBg: '#21252b',
    gutterText: '#4b5263',
    text: '#abb2bf',
    selection: 'rgba(62, 68, 81, 0.7)',
    cursor: '#528bff',
    keyword: '#c678dd', // Magenta
    string: '#98c379',  // Green
    number: '#d19a66',  // Orange
    comment: '#5c6370', // Dark gray
    function: '#61afef',// Blue
    type: '#e5c07b',    // Gold
    operator: '#56b6c2',
    badge: '#c678dd',
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    bg: '#282a36',
    gutterBg: '#1e1f29',
    gutterText: '#6272a4',
    text: '#f8f8f2',
    selection: 'rgba(68, 71, 90, 0.7)',
    cursor: '#f8f8f2',
    keyword: '#ff79c6', // Pink
    string: '#f1fa8c',  // Yellow
    number: '#bd93f9',  // Lavender
    comment: '#6272a4', // Slate
    function: '#50fa7b',// Green
    type: '#8be9fd',    // Cyan
    operator: '#ff79c6',
    badge: '#ff79c6',
  },
};
