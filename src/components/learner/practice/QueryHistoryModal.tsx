import React from 'react';
import { ModalPortal } from '../../common/ModalPortal';
import { History, Trash2, X, Clock, Copy, Code2 } from 'lucide-react';

/**
 * Cấu trúc dữ liệu cho một mục trong lịch sử câu lệnh SQL
 */
export interface QueryHistoryItem {
  id: string;
  sql: string;
  time: string;
  duration: number;
  status: 'success' | 'error';
  rowCount: number;
}

interface QueryHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: QueryHistoryItem[];
  onClearHistory: () => void;
  onSelectQuery: (sql: string) => void;
}

/**
 * Modal hiển thị lịch sử các câu lệnh SQL đã thực thi
 * Cho phép xem lại thời gian chạy, tốc độ thực thi, sao chép hoặc nạp lại vào editor
 */
export const QueryHistoryModal: React.FC<QueryHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectQuery,
}) => {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      >
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-slate-50/70 backdrop-blur-md">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1D1D1F]">Lịch sử truy vấn SQL</h3>
                <p className="text-[11px] text-[#86868B]">{history.length} câu truy vấn đã thực thi gần đây</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
                  title="Xóa toàn bộ lịch sử"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa hết</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-16 space-y-3 text-slate-400">
                <Clock className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-sm font-semibold text-[#1D1D1F]">Chưa có lịch sử truy vấn</p>
                <p className="text-xs text-[#86868B]">Các câu lệnh SQL bạn chạy sẽ được tự động ghi lại tại đây.</p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-black/[0.06] hover:border-black/[0.12] transition space-y-3 group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-mono">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {item.status === 'success' ? 'Thành công' : 'Lỗi cú pháp'}
                      </span>
                      <span className="text-slate-500 text-[11px]">{item.time}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 text-[11px]">{item.duration}ms</span>
                      {item.status === 'success' && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-semibold text-[11px]">{item.rowCount} dòng</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.sql);
                        }}
                        className="p-1.5 rounded-lg bg-white border border-black/[0.08] text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition text-xs flex items-center space-x-1 shadow-2xs cursor-pointer"
                        title="Sao chép truy vấn"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectQuery(item.sql);
                          onClose();
                        }}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold transition shadow-xs active:scale-95 cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Nạp vào Editor</span>
                      </button>
                    </div>
                  </div>

                  <pre className="p-3 rounded-xl bg-[#0F172A] text-slate-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {item.sql}
                  </pre>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-black/[0.06] bg-slate-50/60 backdrop-blur-md flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-[#1D1D1F] text-xs font-semibold transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
