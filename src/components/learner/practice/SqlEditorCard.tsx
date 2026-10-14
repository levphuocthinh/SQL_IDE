import React from 'react';
import { EditorThemeId, EditorTheme } from '../../../types/theme';
import { renderHighlightedTokens } from '../../../utils/sqlHighlighter';
import { IntelliJAutocomplete, SuggestionItem } from '../../IntelliJAutocomplete';
import { 
  Play, 
  Save, 
  Database, 
  RotateCcw, 
  Check, 
  Copy, 
  Code2, 
  Sparkles, 
  Palette, 
  Maximize2, 
  Minimize2, 
  History, 
  RefreshCw, 
  Keyboard 
} from 'lucide-react';

interface SqlEditorCardProps {
  sql: string;
  onChangeSql: (val: string) => void;
  isRunning: boolean;
  formatNotice: boolean;
  resetDbNotice: boolean;
  isStandalone: boolean;
  layoutMode: 'split' | 'stack' | 'fullscreen';
  theme: EditorTheme;
  themeId: EditorThemeId;
  onSelectTheme: (id: EditorThemeId) => void;
  dbEngine: 'PostgreSQL 16' | 'MySQL 8.0' | 'SQLite 3';
  onChangeDbEngine: (engine: 'PostgreSQL 16' | 'MySQL 8.0' | 'SQLite 3') => void;
  onResetDatabase: () => void;
  onOpenHistory: () => void;
  onOpenShortcuts: () => void;
  onFormatCode: () => void;
  onCopySql: () => void;
  copiedSql: boolean;
  onResetLessonCode: () => void;
  onToggleFullscreen: () => void;
  cursorPos: { line: number; col: number };
  lines: string[];
  tokens: any[];
  suggestions: SuggestionItem[];
  selectedIndex: number;
  showAutocomplete: boolean;
  popoverPos: { top: number; left: number };
  onApplySuggestion: (item: SuggestionItem) => void;
  onRunQuery: () => void;
  onSaveToProject: (sql: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  preRef: React.RefObject<HTMLPreElement | null>;
  editorBodyRef: React.RefObject<HTMLDivElement | null>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onScroll: () => void;
  updateCursorAndAutocomplete: (text: string, cursorPosIdx: number) => void;
  historyCount: number;
  isDemoReadOnly?: boolean;
  onTriggerMaintenance?: (feature?: string) => void;
}

/**
 * Trình soạn thảo SQL phong cách macOS Window Chrome
 * Tích hợp đầy đủ:
 * - Syntax Highlighting thời gian thực
 * - Đánh số dòng (Line Numbers Gutter)
 * - Autocomplete thông minh chuẩn IntelliJ
 * - Bộ chọn Theme (One Dark, Darcula, GitHub Dark, Dracula, Light)
 * - Nút chạy SQL và lưu truy vấn vào dự án
 */
export const SqlEditorCard: React.FC<SqlEditorCardProps> = ({
  sql,
  onChangeSql,
  isRunning,
  formatNotice,
  resetDbNotice,
  isStandalone,
  layoutMode,
  theme,
  themeId,
  onSelectTheme,
  dbEngine,
  onChangeDbEngine,
  onResetDatabase,
  onOpenHistory,
  onOpenShortcuts,
  onFormatCode,
  onCopySql,
  copiedSql,
  onResetLessonCode,
  onToggleFullscreen,
  cursorPos,
  lines,
  tokens,
  suggestions,
  selectedIndex,
  showAutocomplete,
  popoverPos,
  onApplySuggestion,
  onRunQuery,
  onSaveToProject,
  textareaRef,
  preRef,
  editorBodyRef,
  onKeyDown,
  onScroll,
  updateCursorAndAutocomplete,
  historyCount,
  isDemoReadOnly = false,
  onTriggerMaintenance,
}) => {
  const isFullScreen = layoutMode === 'fullscreen';

  return (
    <div 
      id="sql-editor-wrapper" 
      style={{ backgroundColor: theme.bg }}
      className={`rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden transition-all relative ${
        isFullScreen ? 'h-full min-h-[480px]' : layoutMode === 'split' ? 'min-h-[540px]' : 'min-h-[420px]'
      }`}
    >
      {/* Tier 1: macOS Window Title Bar */}
      <div 
        style={{ 
          backgroundColor: theme.id === 'classic-light' ? '#eef2f6' : theme.id === 'darcula' ? '#2b2b2b' : '#1e1f29',
          borderColor: theme.id === 'classic-light' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
        }}
        className="px-4 py-2.5 border-b flex items-center justify-between text-xs select-none flex-shrink-0"
      >
        {/* Left: macOS Traffic Lights + Tab Title */}
        <div className="flex items-center space-x-3">
          {/* Traffic Lights */}
          <div className="flex items-center space-x-2 pr-2.5 border-r border-white/10">
            <span 
              onClick={() => {
                if (isDemoReadOnly) {
                  onTriggerMaintenance?.('Xóa trắng trình soạn thảo');
                  return;
                }
                onChangeSql('');
              }}
              title={isDemoReadOnly ? "Đang bảo trì" : "Xóa trắng code (Clear editor)"}
              className="w-3 h-3 rounded-full traffic-light-red cursor-pointer inline-block shadow-sm transition-transform active:scale-90" 
            />
            <span 
              onClick={() => {
                if (isDemoReadOnly) {
                  onTriggerMaintenance?.('Chuẩn hóa format code SQL');
                  return;
                }
                onFormatCode();
              }}
              title={isDemoReadOnly ? "Đang bảo trì" : "Format SQL (Chuẩn hóa code)"}
              className="w-3 h-3 rounded-full traffic-light-yellow cursor-pointer inline-block shadow-sm transition-transform active:scale-90" 
            />
            <span 
              onClick={onToggleFullscreen}
              className="w-3 h-3 rounded-full traffic-light-green cursor-pointer inline-block shadow-sm transition-transform active:scale-90" 
              title={isFullScreen ? "Thu nhỏ giao diện" : "Phóng to toàn màn hình (macOS Fullscreen)"} 
            />
          </div>

          {/* Active Tab */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-xs">
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono text-xs font-bold text-slate-200">query.sql</span>
            <span 
              className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : isDemoReadOnly ? 'bg-amber-400' : 'bg-[#34C759] animate-pulse'} ml-1`} 
              title={isRunning ? "Đang thực thi truy vấn..." : isDemoReadOnly ? "Chế độ Chỉ Xem (Demo Mode)" : "SQL Engine sẵn sàng"} 
            />
          </div>

          {/* Format Notification Toast */}
          {formatNotice && (
            <span className="text-[11px] text-[#34C759] bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/30 animate-pulse font-medium">
              ✓ Đã format code!
            </span>
          )}
        </div>

        {/* Right: Window Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              if (isDemoReadOnly) {
                onTriggerMaintenance?.('Khôi phục lại câu lệnh gốc');
                return;
              }
              onResetLessonCode();
            }}
            title={isDemoReadOnly ? "Đang bảo trì" : "Khôi phục lại câu lệnh gốc (Reset code)"}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleFullscreen}
            title={isFullScreen ? "Thu nhỏ giao diện" : "Phóng to toàn màn hình"}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition active:scale-95 cursor-pointer"
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Dải thông báo Chế độ Xem Demo (Read-Only Maintenance Strip) */}
      {isDemoReadOnly && (
        <div 
          onClick={() => onTriggerMaintenance?.('Chỉnh sửa mã SQL trong bài học')}
          className="px-4 py-2 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border-b border-amber-500/30 flex items-center justify-between text-xs text-amber-200 font-sans cursor-pointer hover:opacity-95 transition select-none"
        >
          <div className="flex items-center space-x-2.5">
            <img src="/images/maintenance-bow.png" alt="Bảo trì" className="w-5 h-5 object-contain" />
            <span>
              <strong>Chế Độ Xem Demo (Chỉ Đọc)</strong>: Trình soạn thảo tạm khóa chỉnh sửa để bảo trì nâng cấp hệ thống.
            </span>
          </div>
          <span className="text-[10px] font-bold bg-amber-500/30 text-amber-100 px-2 py-0.5 rounded-full border border-amber-400/40">
            Xem chi tiết
          </span>
        </div>
      )}

      {/* Tier 2: IDE Action Toolbar (Engine, Theme, Format, Copy, Shortcuts...) */}
      <div 
        style={{ 
          backgroundColor: theme.id === 'classic-light' ? '#f8fafc' : theme.id === 'darcula' ? '#313335' : theme.gutterBg,
          borderColor: theme.id === 'classic-light' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
        }}
        className="px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs select-none flex-shrink-0"
      >
        {/* Left: Engine & Theme Selectors */}
        <div className="flex items-center space-x-2">
          {/* Database Engine Selector */}
          <div className="flex items-center space-x-1.5 bg-black/25 hover:bg-black/35 px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-slate-300 font-medium transition">
            <Database className="w-3 h-3 text-cyan-400 flex-shrink-0" />
            <select
              value={dbEngine}
              onChange={(e) => onChangeDbEngine(e.target.value as any)}
              className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer text-[11px] font-semibold pr-1"
            >
              <option value="PostgreSQL 16" className="bg-slate-900 text-slate-200">PostgreSQL 16</option>
              <option value="MySQL 8.0" className="bg-slate-900 text-slate-200">MySQL 8.0</option>
              <option value="SQLite 3" className="bg-slate-900 text-slate-200">SQLite 3</option>
            </select>
          </div>

          {/* Theme Dropdown */}
          <div className="flex items-center space-x-1.5 bg-black/25 hover:bg-black/35 px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-slate-300 font-medium transition">
            <Palette className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <select
              value={themeId}
              onChange={(e) => onSelectTheme(e.target.value as EditorThemeId)}
              className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer text-[11px] font-semibold pr-1"
            >
              <option value="one-dark" className="bg-slate-900 text-slate-200">One Dark Pro</option>
              <option value="darcula" className="bg-slate-900 text-slate-200">IntelliJ Darcula</option>
              <option value="github-dark" className="bg-slate-900 text-slate-200">GitHub Dark</option>
              <option value="dracula" className="bg-slate-900 text-slate-200">Dracula Vibrant</option>
              <option value="classic-light" className="bg-slate-900 text-slate-200">SQLMaster Light</option>
            </select>
          </div>

          {/* Reset Database Button */}
          <button
            onClick={() => {
              if (isDemoReadOnly) {
                onTriggerMaintenance?.('Khôi phục cơ sở dữ liệu mẫu');
                return;
              }
              onResetDatabase();
            }}
            title={isDemoReadOnly ? "Đang bảo trì" : "Khôi phục dữ liệu ban đầu cho các bảng CSDL (Reset DB)"}
            className="flex items-center space-x-1.5 bg-black/25 hover:bg-black/35 px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-slate-300 hover:text-white font-medium transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 text-emerald-400 ${resetDbNotice ? 'animate-spin' : ''}`} />
            <span>{resetDbNotice ? 'Đã reset DB!' : 'Khôi phục DB'}</span>
          </button>
        </div>

        {/* Right: Quick Code Actions */}
        <div className="flex items-center space-x-2">
          {/* Query History Button */}
          <button
            onClick={onOpenHistory}
            title="Xem lịch sử các câu lệnh đã chạy"
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-[11px] font-semibold transition flex items-center space-x-1.5 border border-white/10 active:scale-95 shadow-xs cursor-pointer"
          >
            <History className="w-3 h-3 text-cyan-400" />
            <span>Lịch sử {historyCount > 0 ? `(${historyCount})` : ''}</span>
          </button>

          {/* Shortcuts Guide Button */}
          <button
            onClick={onOpenShortcuts}
            title="Xem danh sách phím tắt thao tác nhanh"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

          {/* Format SQL Button */}
          <button
            onClick={() => {
              if (isDemoReadOnly) {
                onTriggerMaintenance?.('Định dạng mã SQL');
                return;
              }
              onFormatCode();
            }}
            title={isDemoReadOnly ? "Đang bảo trì" : "Tự động chuẩn hóa viết hoa và căn lề câu lệnh SQL (Format SQL)"}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-[11px] font-semibold transition flex items-center space-x-1.5 border border-white/10 active:scale-95 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Format SQL</span>
          </button>

          {/* Copy SQL Button */}
          <button
            onClick={onCopySql}
            title="Sao chép truy vấn SQL"
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-[11px] font-semibold transition flex items-center space-x-1 border border-white/10 active:scale-95 cursor-pointer"
          >
            {copiedSql ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 text-[10px]">Đã copy</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-300" />
                <span className="text-[10px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body: Line Numbers + Synchronized Syntax Highlighting Overlay */}
      <div 
        ref={editorBodyRef}
        className="flex-1 flex overflow-hidden font-mono text-xs relative min-h-[380px]"
      >
        {/* Line Numbers Gutter */}
        <div 
          style={{ 
            backgroundColor: theme.gutterBg,
            color: theme.gutterText,
            borderColor: theme.id === 'darcula' ? '#3c3f41' : 'rgba(255, 255, 255, 0.08)',
          }}
          className="w-12 py-3 border-r select-none text-right pr-3 font-mono text-[11.5px] leading-[22px] flex-shrink-0"
        >
          {lines.map((_, i) => (
            <div 
              key={i} 
              className={cursorPos.line === i + 1 ? 'text-indigo-400 font-bold' : ''}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Backdrop: Syntax Highlighted Tokens */}
          <pre
            ref={preRef}
            aria-hidden="true"
            style={{
              lineHeight: '22px',
              fontFamily: 'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace',
              fontSize: '13px',
            }}
            className="absolute inset-0 p-3 m-0 pointer-events-none whitespace-pre overflow-hidden select-none font-mono"
          >
            {renderHighlightedTokens(tokens, theme)}
          </pre>

          {/* Foreground: Interactive Textarea with transparent text to let colors shine */}
          <textarea
            ref={textareaRef}
            readOnly={isDemoReadOnly}
            value={sql}
            onChange={(e) => {
              if (isDemoReadOnly) return;
              onChangeSql(e.target.value);
              updateCursorAndAutocomplete(e.target.value, e.target.selectionStart);
            }}
            onKeyDown={(e) => {
              if (isDemoReadOnly) {
                if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
                  return;
                }
                if ((e.key === 'c' || e.key === 'a') && (e.metaKey || e.ctrlKey)) {
                  return;
                }
                e.preventDefault();
                onTriggerMaintenance?.('Chỉnh sửa mã SQL trong bài học');
                return;
              }
              onKeyDown(e);
            }}
            onKeyUp={(e) => {
              if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key)) {
                return;
              }
              updateCursorAndAutocomplete(sql, (e.target as HTMLTextAreaElement).selectionStart);
            }}
            onScroll={onScroll}
            onClick={(e) => {
              if (isDemoReadOnly) {
                onTriggerMaintenance?.('Chỉnh sửa mã SQL trong bài học');
              }
              updateCursorAndAutocomplete(sql, (e.target as HTMLTextAreaElement).selectionStart);
            }}
            placeholder={
              isDemoReadOnly 
                ? "-- Chế độ xem trước (Chỉ đọc) - Bấm vào đây hoặc gõ phím để xem thông tin bảo trì..." 
                : isStandalone 
                  ? "-- Nhập câu truy vấn SQL của bạn tại đây (VD: SELECT * FROM NHANVIEN)..." 
                  : "-- Nhập câu truy vấn SQL của bạn tại đây (nhập chữ để hiện gợi ý IntelliJ)..."
            }
            spellCheck={false}
            style={{
              lineHeight: '22px',
              fontFamily: 'ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace',
              fontSize: '13px',
              caretColor: isDemoReadOnly ? 'transparent' : theme.cursor,
              color: 'transparent',
            }}
            className={`absolute inset-0 w-full h-full p-3 bg-transparent resize-none focus:outline-none scrollbar-thin selection:bg-indigo-500/40 whitespace-pre overflow-auto ${
              isDemoReadOnly ? 'cursor-pointer' : ''
            }`}
          />

          {/* Floating IntelliJ Autocomplete Popover */}
          {!isDemoReadOnly && showAutocomplete && (
            <IntelliJAutocomplete
              suggestions={suggestions}
              selectedIndex={selectedIndex}
              onSelect={onApplySuggestion}
              position={popoverPos}
              theme={theme}
            />
          )}
        </div>
      </div>

      {/* IDE Status Bar */}
      <div 
        style={{ 
          backgroundColor: theme.id === 'classic-light' ? '#f1f5f9' : theme.id === 'darcula' ? '#313335' : theme.gutterBg,
          color: theme.gutterText,
          borderColor: 'rgba(255, 255, 255, 0.08)',
        }}
        className="h-6 px-4 border-t flex items-center justify-between text-[11px] font-mono select-none flex-shrink-0"
      >
        <div className="flex items-center space-x-3 truncate">
          <span className="font-semibold text-slate-300">
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
          <span>•</span>
          <span>{lines.length} dòng ({sql.length} ký tự)</span>
          <span>•</span>
          <span className="hidden sm:inline">UTF-8</span>
          {isDemoReadOnly && (
            <>
              <span>•</span>
              <span className="text-amber-400 font-semibold flex items-center space-x-1">
                <span>[Chỉ Đọc]</span>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-3 text-[10px] flex-shrink-0">
          <span className="text-indigo-400 font-semibold hidden md:inline">
            Tab: Điền gợi ý
          </span>
          <span>•</span>
          <span className="text-slate-300 font-medium">
            Ctrl + Enter: Chạy query
          </span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 bg-white border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3 font-sans">
        <div className="flex items-center space-x-3">
          {/* Nút [▷ Chạy SQL] Apple Blue Pill */}
          <button
            onClick={() => {
              if (isDemoReadOnly) {
                onTriggerMaintenance?.('Chạy câu truy vấn SQL trong bài học');
                return;
              }
              onRunQuery();
            }}
            disabled={isRunning}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white transition-all text-xs font-bold shadow-md shadow-blue-500/25 active:scale-95 disabled:opacity-50 group cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current text-white transition-transform ${isRunning ? 'animate-spin' : 'group-hover:scale-110'}`} />
            <span>{isRunning ? 'Đang thực thi...' : isDemoReadOnly ? 'Chạy SQL (Bảo trì)' : 'Chạy SQL (F5)'}</span>
          </button>

          {/* Nút [💾 Lưu vào dự án] Apple Secondary Pill */}
          <button
            onClick={() => {
              if (isDemoReadOnly) {
                onTriggerMaintenance?.('Lưu câu truy vấn vào dự án');
                return;
              }
              onSaveToProject(sql);
            }}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-black/[0.08] text-[#1D1D1F] font-semibold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Lưu vào dự án</span>
          </button>
        </div>

        <span className="text-xs text-[#86868B] hidden sm:inline font-mono">
          Phím tắt: <kbd className="px-2 py-0.5 rounded-md bg-slate-100 border border-black/[0.08] text-slate-700 font-semibold text-[11px]">⌘</kbd> + <kbd className="px-2 py-0.5 rounded-md bg-slate-100 border border-black/[0.08] text-slate-700 font-semibold text-[11px]">Enter</kbd>
        </span>
      </div>
    </div>
  );
};
