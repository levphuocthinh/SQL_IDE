import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { SQLEngine } from '../../engine/sqlEngine';
import { initialTables, companyDbTables } from '../../engine/initialDb';
import { chaptersData } from '../../roadmap/lessonsData';
import { Lesson } from '../../types/lesson';
import { QueryResult, TableSchema, ExecutionStep } from '../../types/sql';
import { EditorThemeId, EditorTheme, EDITOR_THEMES } from '../../types/theme';
import { tokenizeSql } from '../../utils/sqlHighlighter';
import { SuggestionItem } from '../IntelliJAutocomplete';
import { formatSql } from '../../utils/sqlFormatter';
import { animateQueryBlast, animateResultRows } from '../../utils/animations';
import confetti from 'canvas-confetti';

// Subcomponents
import { PracticeHeader } from './practice/PracticeHeader';
import { SqlEditorCard } from './practice/SqlEditorCard';
import { ResultPanel } from './practice/ResultPanel';
import { LessonHintCard } from './practice/LessonHintCard';
import { QueryHistoryModal, QueryHistoryItem } from './practice/QueryHistoryModal';
import { ShortcutsModal } from './practice/ShortcutsModal';

export type { QueryHistoryItem };

interface PracticeViewProps {
  onSaveToProject: (querySql: string) => void;
  onOpenSchemaModal: () => void;
  onCompleteExercise?: () => void;
  initialLessonId?: string | null;
  initialSqlOverride?: string | null;
  onClearInitialSqlOverride?: () => void;
  isStandalone?: boolean;
  isDemoReadOnly?: boolean;
  onTriggerMaintenance?: (feature?: string, description?: string) => void;
}

/**
 * Trình thực hành truy vấn SQL và Không gian làm việc IDE (PracticeView)
 * Đóng vai trò là Điều phối viên (Coordinator) kết hợp các thành phần:
 * - PracticeHeader: Header thông tin bài học / DB CTY và công cụ bố cục
 * - SqlEditorCard: Bộ soạn thảo code macOS, highlighting và autocomplete
 * - ResultPanel: Lưới bảng kết quả hoặc pipeline kế hoạch thực thi EXPLAIN
 * - LessonHintCard: Gợi ý và đáp án mẫu
 * - QueryHistoryModal & ShortcutsModal: Các modal tiện ích
 */
export const PracticeViewComponent: React.FC<PracticeViewProps> = ({
  onSaveToProject,
  onOpenSchemaModal,
  onCompleteExercise,
  initialLessonId,
  initialSqlOverride,
  onClearInitialSqlOverride,
  isStandalone = false,
  isDemoReadOnly = false,
  onTriggerMaintenance,
}) => {
  // ========================================================
  // 1. Quản lý Khóa học & Bài học hiện tại
  // ========================================================
  const allCurriculumLessons = useMemo(() => chaptersData.flatMap(c => c.lessons), []);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const currentLesson: Lesson = allCurriculumLessons[selectedLessonIndex] || allCurriculumLessons[0];

  // Cơ sở dữ liệu SQLEngine độc lập
  const engineRef = useRef<SQLEngine>(new SQLEngine(isStandalone ? companyDbTables : initialTables));
  const [dbEngine, setDbEngine] = useState<'PostgreSQL 16' | 'MySQL 8.0' | 'SQLite 3'>('PostgreSQL 16');

  // Chế độ bố cục IDE: 'split' (chia đôi), 'stack' (xếp chồng), 'fullscreen' (toàn màn hình)
  const [layoutMode, setLayoutMode] = useState<'split' | 'stack' | 'fullscreen'>('split');

  // ========================================================
  // 2. Trạng thái Giao diện & Theme
  // ========================================================
  const [themeId, setThemeId] = useState<EditorThemeId>(() => {
    try {
      return (localStorage.getItem('sql_editor_theme') as EditorThemeId) || 'one-dark';
    } catch {
      return 'one-dark';
    }
  });
  const theme: EditorTheme = EDITOR_THEMES[themeId] || EDITOR_THEMES['one-dark'];

  const handleSelectTheme = (newThemeId: EditorThemeId) => {
    setThemeId(newThemeId);
    try {
      localStorage.setItem('sql_editor_theme', newThemeId);
    } catch {}
  };

  // ========================================================
  // 3. Trạng thái Câu lệnh SQL & Con trỏ
  // ========================================================
  const [sql, setSql] = useState<string>(() => {
    if (isStandalone) {
      return `-- Chào mừng bạn đến với SQLFlow Playground!
-- Đã nạp sẵn 4 bảng Tiếng Việt: PHONGBAN, NHANVIEN, DUAN, PHANCONG
-- Bấm "Chạy Truy Vấn (Cmd/Ctrl + Enter)" để trải nghiệm ngay:

SELECT nv.MANV, nv.HOTEN, nv.CHUCVU, nv.LUONG, pb.TENPB
FROM NHANVIEN nv
JOIN PHONGBAN pb ON nv.MAPB = pb.MAPB
ORDER BY nv.LUONG DESC;`;
    }
    return allCurriculumLessons[0]?.initialSql || 'SELECT * FROM NHANVIEN;';
  });

  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [exerciseStatus, setExerciseStatus] = useState<{
    tested: boolean;
    passed: boolean;
    message: string;
  } | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [copiedData, setCopiedData] = useState<boolean>(false);
  const [formatNotice, setFormatNotice] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ line: number; col: number }>({ line: 1, col: 1 });

  // Pipeline EXPLAIN & Kết quả
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [resultTab, setResultTab] = useState<'table' | 'explain'>('table');

  // Lịch sử truy vấn & Modals
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [resetDbNotice, setResetDbNotice] = useState<boolean>(false);

  // Tham chiếu DOM Editor
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const editorBodyRef = useRef<HTMLDivElement>(null);

  // Autocomplete Popup State
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [currentPrefix, setCurrentPrefix] = useState<string>('');
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // ========================================================
  // 4. Đồng bộ dữ liệu khi chuyển bài hoặc ghi đè SQL
  // ========================================================
  useEffect(() => {
    if (!isStandalone && initialLessonId) {
      const idx = allCurriculumLessons.findIndex(l => l.id === initialLessonId);
      if (idx !== -1) {
        setSelectedLessonIndex(idx);
        const targetLesson = allCurriculumLessons[idx];
        setSql(targetLesson.initialSql || 'SELECT * FROM employees;');
        setQueryResult(null);
        setExecutionSteps([]);
        setExerciseStatus(null);
        setIsSuccess(false);
      }
    }
  }, [initialLessonId, allCurriculumLessons, isStandalone]);

  useEffect(() => {
    if (initialSqlOverride) {
      setSql(initialSqlOverride);
      setQueryResult(null);
      setExecutionSteps([]);
      onClearInitialSqlOverride?.();
    }
  }, [initialSqlOverride, onClearInitialSqlOverride]);

  // Khôi phục CSDL về trạng thái ban đầu
  const handleResetDatabase = () => {
    engineRef.current.resetWith(isStandalone ? companyDbTables : initialTables);
    setResetDbNotice(true);
    setTimeout(() => setResetDbNotice(false), 2000);
  };



  // Xử lý chuyển bài học
  const handleSelectLesson = (idx: number) => {
    setSelectedLessonIndex(idx);
    const newLesson = allCurriculumLessons[idx];
    if (newLesson) {
      setSql(newLesson.initialSql || 'SELECT * FROM employees;');
      setQueryResult(null);
      setIsSuccess(false);
      setExerciseStatus(null);
      setExecutionTime(null);
    }
  };

  // Đồng bộ cuộn giữa textarea và pre highlight
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // ========================================================
  // 5. Hệ thống gợi ý Autocomplete thông minh theo ngữ cảnh (Context-Aware)
  // ========================================================
  const updateCursorAndAutocomplete = useCallback((text: string, cursorPosIdx: number) => {
    const beforeCursor = text.slice(0, cursorPosIdx);
    const lines = beforeCursor.split('\n');
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;
    setCursorPos({ line: currentLine, col: currentCol });

    const lastChar = beforeCursor.slice(-1);
    if (!lastChar || /[\s,;()=><+\-*/]/.test(lastChar)) {
      setShowAutocomplete(false);
      setCurrentPrefix('');
      return;
    }

    const match = beforeCursor.match(/([a-zA-Z_0-9*.]+)?$/);
    const prefix = match ? match[0] : '';

    if (!prefix || prefix.trim().length === 0) {
      setShowAutocomplete(false);
      setCurrentPrefix('');
      return;
    }

    const tables: TableSchema[] = engineRef.current.getTables();
    const textBeforePrefix = beforeCursor.slice(0, beforeCursor.length - prefix.length).trimEnd();

    let candidateSuggestions: SuggestionItem[] = [];

    // --- NGỮ CẢNH 1: Dấu chấm (Truy xuất cột theo bảng hoặc alias: e.g. nv. hoặc PHONGBAN.) ---
    if (prefix.includes('.')) {
      const dotParts = prefix.split('.');
      const qualifier = dotParts[0].toLowerCase();
      const colPrefix = dotParts.slice(1).join('.').toLowerCase();

      // Tìm bảng tương ứng trực tiếp hoặc qua alias trong câu lệnh
      let targetTable = tables.find(t => t.name.toLowerCase() === qualifier);
      if (!targetTable) {
        // Tìm alias trong text (ví dụ: FROM NHANVIEN nv hoặc JOIN PHONGBAN pb)
        const aliasRegex = new RegExp(`(?:FROM|JOIN)\\s+([a-zA-Z0-9_]+)\\s+(?:AS\\s+)?${qualifier}\\b`, 'i');
        const aliasMatch = text.match(aliasRegex);
        if (aliasMatch) {
          const matchedTableName = aliasMatch[1];
          targetTable = tables.find(t => t.name.toLowerCase() === matchedTableName.toLowerCase());
        }
      }

      if (targetTable) {
        candidateSuggestions = targetTable.columns
          .filter(c => !colPrefix || c.name.toLowerCase().startsWith(colPrefix))
          .map(c => ({
            label: `${dotParts[0]}.${c.name}`,
            type: 'column' as const,
            insertText: `${dotParts[0]}.${c.name}`,
            detail: `Cột ${c.type} (${targetTable!.name})`,
          }));
      }
    }
    // --- NGỮ CẢNH 2: Sau các từ khóa bảng (FROM, JOIN, INTO, UPDATE, TABLE) ---
    else if (/\b(FROM|JOIN|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN|INTO|UPDATE|TABLE)\s*$/i.test(textBeforePrefix)) {
      // Chỉ gợi ý TÊN BẢNG, tuyệt đối không gợi ý cột hay hàm
      candidateSuggestions = tables
        .filter(t => t.name.toLowerCase().startsWith(prefix.toLowerCase()))
        .map(t => ({
          label: t.name,
          type: 'table' as const,
          insertText: t.name,
          detail: `Bảng CSDL (${t.rows.length} hàng)`,
        }));
    }
    // --- NGỮ CẢNH 3: Biểu thức, Cột, Hàm (SELECT, WHERE, ORDER BY, GROUP BY, ON, SET) ---
    else {
      const prefixLower = prefix.toLowerCase();

      // 1. Cột dữ liệu (Deduplicate tên cột)
      const columnItemsMap = new Map<string, SuggestionItem>();
      tables.forEach(t => {
        t.columns.forEach(c => {
          if (!columnItemsMap.has(c.name)) {
            columnItemsMap.set(c.name, {
              label: c.name,
              type: 'column',
              insertText: c.name,
              detail: `Cột ${c.type} (${t.name})`,
            });
          }
        });
      });

      const matchingColumns = Array.from(columnItemsMap.values()).filter(c =>
        c.label.toLowerCase().startsWith(prefixLower)
      );

      // 2. Hàm SQL
      const sqlFunctions: SuggestionItem[] = [
        { label: 'COUNT()', type: 'function' as const, insertText: 'COUNT()', detail: 'Hàm đếm số lượng' },
        { label: 'SUM()', type: 'function' as const, insertText: 'SUM()', detail: 'Hàm tính tổng' },
        { label: 'AVG()', type: 'function' as const, insertText: 'AVG()', detail: 'Hàm tính trung bình' },
        { label: 'MAX()', type: 'function' as const, insertText: 'MAX()', detail: 'Hàm giá trị lớn nhất' },
        { label: 'MIN()', type: 'function' as const, insertText: 'MIN()', detail: 'Hàm giá trị nhỏ nhất' },
        { label: 'ROUND()', type: 'function' as const, insertText: 'ROUND(, 2)', detail: 'Làm tròn số' },
      ].filter(f => f.label.toLowerCase().startsWith(prefixLower));

      // 3. Từ khóa SQL chính
      const sqlKeywords: SuggestionItem[] = [
        { label: 'SELECT', type: 'keyword' as const, insertText: 'SELECT ', detail: 'Mệnh đề truy vấn' },
        { label: 'FROM', type: 'keyword' as const, insertText: 'FROM ', detail: 'Chỉ định bảng nguồn' },
        { label: 'WHERE', type: 'keyword' as const, insertText: 'WHERE ', detail: 'Điều kiện lọc dòng' },
        { label: 'JOIN', type: 'keyword' as const, insertText: 'JOIN ', detail: 'Kết nối bảng' },
        { label: 'GROUP BY', type: 'keyword' as const, insertText: 'GROUP BY ', detail: 'Gom nhóm bản ghi' },
        { label: 'ORDER BY', type: 'keyword' as const, insertText: 'ORDER BY ', detail: 'Sắp xếp kết quả' },
        { label: 'HAVING', type: 'keyword' as const, insertText: 'HAVING ', detail: 'Lọc sau khi nhóm' },
        { label: 'LIMIT', type: 'keyword' as const, insertText: 'LIMIT ', detail: 'Giới hạn số dòng' },
        { label: 'AS', type: 'keyword' as const, insertText: 'AS ', detail: 'Đặt bí danh' },
        { label: 'DISTINCT', type: 'keyword' as const, insertText: 'DISTINCT ', detail: 'Loại bỏ trùng lặp' },
      ].filter(k => k.label.toLowerCase().startsWith(prefixLower));

      // Ưu tiên cột trước, sau đó đến hàm và từ khóa
      candidateSuggestions = [...matchingColumns, ...sqlFunctions, ...sqlKeywords];
    }

    // Lọc trùng lặp & giới hạn tối đa 6 gợi ý chuẩn xác nhất
    const uniqueMap = new Map<string, SuggestionItem>();
    candidateSuggestions.forEach(item => {
      if (!uniqueMap.has(item.label)) {
        uniqueMap.set(item.label, item);
      }
    });

    const finalSuggestions = Array.from(uniqueMap.values()).slice(0, 6);

    // Nếu từ người dùng đã gõ hoàn toàn khớp với gợi ý duy nhất thì không hiện popover nữa
    if (finalSuggestions.length === 1 && finalSuggestions[0].label.toLowerCase() === prefix.toLowerCase()) {
      setShowAutocomplete(false);
      setCurrentPrefix('');
      return;
    }

    if (finalSuggestions.length > 0) {
      setSuggestions(finalSuggestions);
      setSelectedIndex(0);
      setCurrentPrefix(prefix);

      const lineHeight = 22;
      const charWidth = 7.8;
      const top = (currentLine - 1) * lineHeight + 28 - (textareaRef.current?.scrollTop || 0);
      const left = (currentCol - 1) * charWidth + 12 - (textareaRef.current?.scrollLeft || 0);

      setPopoverPos({
        top: Math.max(10, top),
        left: Math.max(10, Math.min(left, 450)),
      });
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
      setCurrentPrefix('');
    }
  }, []);

  // Điền gợi ý vào vị trí con trỏ & ĐÓNG NGAY LẬP TỨC
  const handleApplySuggestion = useCallback((item: SuggestionItem) => {
    if (!textareaRef.current) return;
    const cursorPosIdx = textareaRef.current.selectionStart;
    const textBefore = sql.slice(0, cursorPosIdx);
    const textAfter = sql.slice(cursorPosIdx);

    const prefixLen = currentPrefix.length;
    const prefixStart = Math.max(0, cursorPosIdx - prefixLen);
    const newText = sql.slice(0, prefixStart) + item.insertText + textAfter;

    setSql(newText);
    setShowAutocomplete(false);
    setCurrentPrefix('');

    // Đặt lại con trỏ ở cuối từ vừa điền và giữ đóng popover
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = prefixStart + item.insertText.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);

        const before = newText.slice(0, newCursorPos);
        const l = before.split('\n');
        setCursorPos({ line: l.length, col: l[l.length - 1].length + 1 });
      }
    }, 10);
  }, [sql, currentPrefix]);

  // Phím tắt bàn phím
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showAutocomplete && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        handleApplySuggestion(suggestions[selectedIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAutocomplete(false);
        setCurrentPrefix('');
        return;
      }
    }

    // Ctrl/Cmd + Enter hoặc F5 để chạy query
    if ((e.key === 'Enter' && (e.ctrlKey || e.metaKey)) || e.key === 'F5') {
      e.preventDefault();
      handleRunQuery();
      return;
    }

    // Shift + Alt + F để format SQL
    if (e.shiftKey && e.altKey && (e.key === 'F' || e.key === 'f')) {
      e.preventDefault();
      handleFormatCode();
      return;
    }

    // Tab để thụt lề 2 spaces
    if (e.key === 'Tab' && !showAutocomplete) {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newSql = sql.substring(0, start) + '  ' + sql.substring(end);
      setSql(newSql);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // ========================================================
  // 6. Thực thi truy vấn SQL (Query Execution Engine)
  // ========================================================
  const handleRunQuery = () => {
    setIsRunning(true);
    const start = performance.now();

    animateQueryBlast();

    setTimeout(() => {
      const { result, steps } = engineRef.current.execute(sql);
      const end = performance.now();
      const duration = Math.round(end - start);
      setExecutionTime(duration);
      setQueryResult(result);
      setIsRunning(false);

      // Thêm vào lịch sử truy vấn
      const newHistoryItem: QueryHistoryItem = {
        id: `hist-${Date.now()}`,
        sql: sql.trim(),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        duration,
        status: result.error ? 'error' : 'success',
        rowCount: result.rows ? result.rows.length : 0,
      };
      setQueryHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]);

      if (steps) {
        setExecutionSteps(steps);
      }

      // Đánh giá bài học khi không ở chế độ standalone
      if (!isStandalone && currentLesson.exercise?.criteria) {
        const criteria = currentLesson.exercise.criteria;
        let passed = true;
        let message = 'Chính xác! Bạn đã hoàn thành yêu cầu.';

        if (result.error) {
          passed = false;
          message = 'Câu lệnh gặp lỗi cú pháp. Vui lòng kiểm tra lại.';
        } else {
          if (criteria.expectedRowCount !== undefined && result.rows.length !== criteria.expectedRowCount) {
            passed = false;
            message = `Số dòng kết quả chưa khớp (cần ${criteria.expectedRowCount}, nhận ${result.rows.length}).`;
          }

          if (passed && criteria.requiredKeywords) {
            const upperSql = sql.toUpperCase();
            for (const kw of criteria.requiredKeywords) {
              if (!upperSql.includes(kw.toUpperCase())) {
                passed = false;
                message = `Truy vấn cần sử dụng từ khóa bắt buộc: "${kw}".`;
                break;
              }
            }
          }

          if (passed && criteria.customValidation) {
            const valResult = criteria.customValidation(sql, result, engineRef.current.getTables());
            if (!valResult.success) {
              passed = false;
              message = valResult.message;
            }
          }
        }

        setExerciseStatus({ tested: true, passed, message });

        if (passed) {
          setIsSuccess(true);
          onCompleteExercise?.();
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0071E3', '#34C759', '#FF9500', '#AF52DE'],
          });
        }
      }

      if (!result.error && result.rows.length > 0) {
        setTimeout(() => animateResultRows(), 50);
      }
    }, 200);
  };

  // Format Code SQL
  const handleFormatCode = () => {
    const formatted = formatSql(sql);
    setSql(formatted);
    setFormatNotice(true);
    setTimeout(() => setFormatNotice(false), 2000);
  };

  // Sao chép code SQL
  const handleCopySql = () => {
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Xuất file CSV
  const handleExportCsv = () => {
    if (!queryResult || queryResult.rows.length === 0) return;
    const headers = queryResult.columns.join(',');
    const rows = queryResult.rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(`${headers}\n${rows}`);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `sql_result_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sao chép dữ liệu JSON
  const handleCopyJson = () => {
    if (!queryResult) return;
    const jsonStr = JSON.stringify(queryResult.rows.map(row => {
      const obj: any = {};
      queryResult.columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      return obj;
    }), null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  const lines = useMemo(() => sql.split('\n'), [sql]);
  const tokens = useMemo(() => tokenizeSql(sql), [sql]);
  const isFullScreen = layoutMode === 'fullscreen';

  return (
    <div className={`p-4 md:p-6 space-y-5 max-w-[1680px] mx-auto overflow-y-auto ${isFullScreen ? 'fixed inset-0 z-[100] bg-[#F4F6F9] p-4 flex flex-col' : ''}`}>
      
      {/* 1. Header bài học / Playground DB CTY */}
      <PracticeHeader
        isStandalone={isStandalone}
        currentLesson={currentLesson}
        selectedLessonIndex={selectedLessonIndex}
        allCurriculumLessons={allCurriculumLessons}
        onSelectLesson={handleSelectLesson}
        layoutMode={layoutMode}
        onChangeLayoutMode={setLayoutMode}
        onOpenSchemaModal={onOpenSchemaModal}
        onQuickQuerySelect={(query) => {
          if (isDemoReadOnly) {
            onTriggerMaintenance?.('Thay đổi câu lệnh truy vấn');
            return;
          }
          setSql(query);
        }}
      />

      {/* 2. Khung làm việc IDE (Editor & Results) */}
      <div className={`grid gap-6 items-stretch ${
        isFullScreen 
          ? 'flex-1 grid-cols-1 lg:grid-cols-2 min-h-0' 
          : layoutMode === 'split' 
            ? 'grid-cols-1 lg:grid-cols-2' 
            : 'grid-cols-1'
      }`}>
        
        {/* Editor Card */}
        <SqlEditorCard
          sql={sql}
          onChangeSql={setSql}
          isRunning={isRunning}
          formatNotice={formatNotice}
          resetDbNotice={resetDbNotice}
          isStandalone={isStandalone}
          layoutMode={layoutMode}
          theme={theme}
          themeId={themeId}
          onSelectTheme={handleSelectTheme}
          dbEngine={dbEngine}
          onChangeDbEngine={setDbEngine}
          onResetDatabase={handleResetDatabase}
          onOpenHistory={() => setShowHistoryModal(true)}
          onOpenShortcuts={() => setShowShortcutsModal(true)}
          onFormatCode={handleFormatCode}
          onCopySql={handleCopySql}
          copiedSql={copiedSql}
          onResetLessonCode={() => setSql(currentLesson.initialSql || 'SELECT * FROM NHANVIEN;')}
          onToggleFullscreen={() => setLayoutMode(layoutMode === 'fullscreen' ? 'split' : 'fullscreen')}
          cursorPos={cursorPos}
          lines={lines}
          tokens={tokens}
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          showAutocomplete={showAutocomplete}
          popoverPos={popoverPos}
          onApplySuggestion={handleApplySuggestion}
          onRunQuery={handleRunQuery}
          onSaveToProject={onSaveToProject}
          textareaRef={textareaRef}
          preRef={preRef}
          editorBodyRef={editorBodyRef}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          updateCursorAndAutocomplete={updateCursorAndAutocomplete}
          historyCount={queryHistory.length}
          isDemoReadOnly={isDemoReadOnly}
          onTriggerMaintenance={onTriggerMaintenance}
        />

        {/* Results Card */}
        <ResultPanel
          resultTab={resultTab}
          onChangeResultTab={setResultTab}
          queryResult={queryResult}
          executionSteps={executionSteps}
          executionTime={executionTime}
          isStandalone={isStandalone}
          layoutMode={layoutMode}
          exerciseStatus={exerciseStatus}
          selectedLessonIndex={selectedLessonIndex}
          totalLessons={allCurriculumLessons.length}
          onSelectLesson={handleSelectLesson}
          onShowHint={() => {
            const el = document.getElementById('lesson-hint-box');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onExportCsv={handleExportCsv}
          onCopyJson={handleCopyJson}
          copiedData={copiedData}
        />
      </div>

      {/* 3. Thẻ gợi ý & hướng dẫn giải bài tập */}
      {!isFullScreen && !isStandalone && (
        <div id="lesson-hint-box">
          <LessonHintCard
            hint={currentLesson.hint}
            solutionSql={currentLesson.solutionSql}
            onLoadSolution={(solution) => {
              if (isDemoReadOnly) {
                onTriggerMaintenance?.('Tải câu lệnh đáp án mẫu');
                return;
              }
              setSql(solution);
            }}
          />
        </div>
      )}

      {/* 4. Modal: Lịch sử truy vấn */}
      <QueryHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={queryHistory}
        onClearHistory={() => setQueryHistory([])}
        onSelectQuery={(historySql) => setSql(historySql)}
      />

      {/* 5. Modal: Hướng dẫn phím tắt */}
      <ShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </div>
  );
};

export const PracticeView = React.memo(PracticeViewComponent);
