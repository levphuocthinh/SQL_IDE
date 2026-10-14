import React from 'react';
import { QueryResult, ExecutionStep } from '../../../types/sql';
import { 
  Table, 
  GitBranch, 
  Zap, 
  Download, 
  Copy, 
  Check, 
  Database, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  HelpCircle 
} from 'lucide-react';

interface ResultPanelProps {
  resultTab: 'table' | 'explain';
  onChangeResultTab: (tab: 'table' | 'explain') => void;
  queryResult: QueryResult | null;
  executionSteps: ExecutionStep[];
  executionTime: number | null;
  isStandalone: boolean;
  layoutMode: 'split' | 'stack' | 'fullscreen';
  exerciseStatus: {
    tested: boolean;
    passed: boolean;
    message: string;
  } | null;
  selectedLessonIndex: number;
  totalLessons: number;
  onSelectLesson: (idx: number) => void;
  onShowHint: () => void;
  onExportCsv: () => void;
  onCopyJson: () => void;
  copiedData: boolean;
}

/**
 * Bảng hiển thị kết quả thực thi truy vấn SQL (Result Panel)
 * Hỗ trợ 2 chế độ xem:
 * 1. Bảng dữ liệu (Table View): Hiển thị lưới bảng dữ liệu kết quả, hỗ trợ xuất CSV / sao chép JSON
 * 2. Kế hoạch EXPLAIN (Execution Plan): Mô phỏng từng giai đoạn thực thi (Scan, Filter, Join, Group...)
 */
export const ResultPanel: React.FC<ResultPanelProps> = ({
  resultTab,
  onChangeResultTab,
  queryResult,
  executionSteps,
  executionTime,
  isStandalone,
  layoutMode,
  exerciseStatus,
  selectedLessonIndex,
  totalLessons,
  onSelectLesson,
  onShowHint,
  onExportCsv,
  onCopyJson,
  copiedData,
}) => {
  const isFullScreen = layoutMode === 'fullscreen';

  return (
    <div className={`apple-card flex flex-col overflow-hidden font-sans ${
      isFullScreen ? 'h-full min-h-[480px]' : layoutMode === 'split' ? 'min-h-[540px]' : 'min-h-[420px]'
    }`}>
      {/* 1. Header with Segmented Tabs */}
      <div className="px-6 py-3 border-b border-black/[0.06] flex items-center justify-between flex-shrink-0 bg-slate-50/70 backdrop-blur-md">
        {/* Segmented Control */}
        <div className="flex items-center bg-black/[0.05] p-1 rounded-xl space-x-1">
          <button
            onClick={() => onChangeResultTab('table')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              resultTab === 'table'
                ? 'bg-white text-[#1D1D1F] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Bảng dữ liệu</span>
            {queryResult && !queryResult.error && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                {queryResult.rows.length}
              </span>
            )}
          </button>

          <button
            onClick={() => onChangeResultTab('explain')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              resultTab === 'explain'
                ? 'bg-white text-[#1D1D1F] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-600" />
            <span>Kế hoạch EXPLAIN</span>
            {executionSteps.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 font-mono font-bold">
                {executionSteps.length}
              </span>
            )}
          </button>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-2">
          {executionTime !== null && (
            <span className="text-[11px] font-mono text-slate-600 bg-white px-2.5 py-0.5 rounded-full border border-black/[0.08] flex items-center space-x-1 shadow-xs font-semibold">
              <Zap className="w-3 h-3 text-[#FF9500]" />
              <span>{executionTime}ms</span>
            </span>
          )}

          {resultTab === 'table' && queryResult && !queryResult.error && queryResult.rows.length > 0 && (
            <div className="flex items-center space-x-1 pl-1">
              <button
                onClick={onExportCsv}
                title="Xuất file CSV"
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onCopyJson}
                title="Sao chép JSON"
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                {copiedData ? (
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Results Content */}
      <div className="flex-1 p-6 flex flex-col justify-start overflow-auto">
        {resultTab === 'explain' ? (
          executionSteps.length === 0 ? (
            /* Explain Empty State */
            <div className="flex flex-col items-center justify-center text-slate-400 py-16 space-y-3 my-auto">
              <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 shadow-sm">
                <GitBranch className="w-8 h-8" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-[#1D1D1F] font-bold">
                  Chưa có kế hoạch thực thi EXPLAIN
                </p>
                <p className="text-xs text-[#86868B] font-medium max-w-sm">
                  Nhấn <strong className="text-[#1D1D1F]">“Chạy SQL”</strong> hoặc bấm <strong className="text-[#1D1D1F]">⌘ + Enter</strong> để bộ máy phân tích từng giai đoạn xử lý dữ liệu.
                </p>
              </div>
            </div>
          ) : (
            /* Explain Pipeline Timeline */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
                <div>
                  <h4 className="text-sm font-bold text-[#1D1D1F]">Pipeline Kế hoạch thực thi (Execution Plan)</h4>
                  <p className="text-xs text-[#86868B]">Mô phỏng chi tiết các bước từ đọc dữ liệu đến xuất kết quả cuối</p>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {executionSteps.length} giai đoạn
                </span>
              </div>

              <div className="space-y-3 relative pl-4 border-l-2 border-slate-200/80 ml-2">
                {executionSteps.map((step, idx) => {
                  const phaseBadgeColors: Record<string, string> = {
                    SCAN: 'bg-blue-50 text-blue-700 border-blue-200',
                    JOIN_MATCH: 'bg-purple-50 text-purple-700 border-purple-200',
                    FILTER_WHERE: 'bg-amber-50 text-amber-700 border-amber-200',
                    GROUP: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    PROJECT_SELECT: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    DONE: 'bg-slate-100 text-slate-700 border-slate-200',
                  };

                  return (
                    <div key={step.id || idx} className="relative group">
                      {/* Dot marker on pipeline line */}
                      <div className="absolute -left-[23px] top-3.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0071E3] shadow-xs" />

                      <div className="p-4 rounded-2xl bg-white border border-black/[0.08] shadow-xs hover:border-black/[0.15] transition-all space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-slate-400">
                              #{idx + 1}
                            </span>
                            <h5 className="font-bold text-sm text-[#1D1D1F]">{step.title}</h5>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${phaseBadgeColors[step.phase] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                            {step.phase}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          {step.description}
                        </p>

                        {step.activeTables && step.activeTables.length > 0 && (
                          <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-500 font-mono">
                            <span>Bảng liên quan:</span>
                            {step.activeTables.map((t, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60 font-semibold">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {step.interimData && step.interimData.rows && (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Dữ liệu xử lý trung gian:</span>
                            <span className="font-bold text-slate-700 font-mono">
                              {step.interimData.rows.length} dòng ({step.interimData.headers.join(', ')})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : !queryResult ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center text-slate-400 py-16 space-y-3 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0071E3] shadow-sm">
              <Database className="w-8 h-8" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm text-[#1D1D1F] font-bold">
                Chưa có kết quả truy vấn
              </p>
              <p className="text-xs text-[#86868B] font-medium">
                Nhấn nút <strong className="text-[#1D1D1F]">“Chạy SQL”</strong> hoặc bấm <strong className="text-[#1D1D1F]">⌘ + Enter</strong> để thực thi.
              </p>
            </div>
          </div>
        ) : queryResult.error ? (
          /* Error banner */
          <div className="p-5 rounded-2xl bg-rose-50/90 border border-rose-200/90 text-rose-900 text-xs space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-rose-900 text-sm">
                <AlertCircle className="w-4 h-4 text-[#FF3B30] flex-shrink-0" />
                <span>Lỗi cú pháp SQL (Syntax / Execution Error):</span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                Cú pháp không hợp lệ
              </span>
            </div>
            <div className="bg-white/80 p-3.5 rounded-xl border border-rose-200 font-mono text-[11.5px] text-rose-800 whitespace-pre-wrap shadow-inner leading-relaxed">
              {queryResult.error}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-rose-700 pt-1 border-t border-rose-200/60">
              <p className="font-medium">
                💡 Gợi ý: Kiểm tra dấu phẩy thừa (,,), mệnh đề WHERE thiếu điều kiện hoặc tên cột/bảng.
              </p>
              {!isStandalone && (
                <button
                  onClick={onShowHint}
                  className="text-blue-600 hover:text-blue-800 font-bold underline flex-shrink-0 cursor-pointer"
                >
                  Xem đáp án mẫu
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Data Table Output & Exercise Status Banner */
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Exercise Assessment Status Banner */}
            {!isStandalone && exerciseStatus && (
              <div className={`p-4 rounded-2xl border transition-all ${
                exerciseStatus.passed
                  ? 'bg-emerald-50/90 border-emerald-200/90 text-emerald-900 shadow-sm'
                  : 'bg-amber-50/90 border-amber-200/90 text-amber-900 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                      exerciseStatus.passed
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
                        : 'bg-amber-500 shadow-sm shadow-amber-500/30'
                    }`}>
                      {exerciseStatus.passed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1D1D1F]">
                        {exerciseStatus.passed
                          ? '🎉 Xuất sắc! Thử thách hoàn thành chính xác'
                          : '⚠️ Chưa đạt yêu cầu bài học'}
                      </p>
                      <p className={`text-xs mt-0.5 font-medium ${
                        exerciseStatus.passed ? 'text-emerald-700' : 'text-amber-800'
                      }`}>
                        {exerciseStatus.message}
                      </p>
                    </div>
                  </div>

                  {exerciseStatus.passed ? (
                    selectedLessonIndex < totalLessons - 1 && (
                      <button
                        onClick={() => onSelectLesson(selectedLessonIndex + 1)}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold transition shadow-sm active:scale-95 flex-shrink-0 cursor-pointer"
                      >
                        <span>Bài tiếp theo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )
                  ) : (
                    <button
                      onClick={onShowHint}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold transition active:scale-95 flex-shrink-0 shadow-xs cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Xem gợi ý giải</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-2 border-b border-slate-100">
              <span className="flex items-center space-x-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Truy vấn thành công!</span>
              </span>
              <span className="font-bold text-slate-700">
                {queryResult.rows.length} dòng dữ liệu {executionTime ? `(${executionTime}ms)` : ''}
              </span>
            </div>

            {queryResult.rows.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-mono">
                (Không có bản ghi nào thỏa mãn điều kiện lọc)
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm max-h-[440px] scrollbar-thin">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      {/* Row Index Column */}
                      <th className="px-3 py-2.5 w-12 text-center text-slate-400 border-r border-slate-200/60 font-medium">
                        #
                      </th>
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="px-4 py-2.5 whitespace-nowrap border-r border-slate-200/60 last:border-r-0">
                          <span>{col}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {queryResult.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="ide-result-row hover:bg-indigo-50/50 transition">
                        <td className="px-3 py-2 text-center text-slate-400 border-r border-slate-100 text-[11px] font-semibold">
                          {rIdx + 1}
                        </td>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-2 text-slate-800 whitespace-nowrap border-r border-slate-100 last:border-r-0">
                            {cell === null ? (
                              <span className="text-slate-400 italic text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">NULL</span>
                            ) : (
                              String(cell)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
