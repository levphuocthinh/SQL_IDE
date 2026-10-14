import React from 'react';
import { ModalPortal } from '../../common/ModalPortal';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal hiển thị bảng tra cứu các phím tắt nhanh trong IDE SQL
 * Giúp người dùng ghi nhớ thao tác chạy lệnh, format, gợi ý autocomplete...
 */
export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      >
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-slate-50/70 backdrop-blur-md">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0071E3]">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1D1D1F]">Phím tắt IDE SQL</h3>
                <p className="text-[11px] text-[#86868B]">Các tổ hợp phím giúp thao tác soạn thảo và thực thi nhanh hơn</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="divide-y divide-black/[0.06] border border-black/[0.06] rounded-2xl overflow-hidden bg-slate-50/50">
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Chạy truy vấn SQL</span>
                <div className="flex items-center space-x-1.5">
                  <kbd className="px-2 py-1 rounded-md bg-white border border-black/[0.1] text-xs font-mono font-bold text-slate-800 shadow-2xs">⌘ / Ctrl</kbd>
                  <span className="text-slate-400 text-xs">+</span>
                  <kbd className="px-2 py-1 rounded-md bg-white border border-black/[0.1] text-xs font-mono font-bold text-slate-800 shadow-2xs">Enter</kbd>
                  <span className="text-slate-400 text-xs">hoặc</span>
                  <kbd className="px-2 py-1 rounded-md bg-white border border-black/[0.1] text-xs font-mono font-bold text-slate-800 shadow-2xs">F5</kbd>
                </div>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Chọn gợi ý từ khóa (Autocomplete)</span>
                <div className="flex items-center space-x-1.5">
                  <kbd className="px-2 py-1 rounded-md bg-white border border-black/[0.1] text-xs font-mono font-bold text-slate-800 shadow-2xs">Tab</kbd>
                  <span className="text-slate-400 text-xs">hoặc</span>
                  <kbd className="px-2 py-1 rounded-md bg-white border border-black/[0.1] text-xs font-mono font-bold text-slate-800 shadow-2xs">Enter</kbd>
                </div>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Di chuyển chọn gợi ý</span>
                <div className="flex items-center space-x-1.5">
                  <kbd className="px-2 py-1 rounded-md bg-white border border-black/[0.1] text-xs font-mono font-bold text-slate-800 shadow-2xs">↑</kbd>
                  <span className="text-slate-400 text-xs">/</span>
                  <kbd className="px-2 py-1 rounded-md bg-white border border-black/[0.1] text-xs font-mono font-bold text-slate-800 shadow-2xs">↓</kbd>
                </div>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Đóng gợi ý / Đóng popup</span>
                <kbd className="px-2 py-1 rounded-md bg-white border border-black/[0.1] text-xs font-mono font-bold text-slate-800 shadow-2xs">Esc</kbd>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Thụt lề (Indentation)</span>
                <kbd className="px-2 py-1 rounded-md bg-white border border-black/[0.1] text-xs font-mono font-bold text-slate-800 shadow-2xs">Tab (2 spaces)</kbd>
              </div>
            </div>

            {/* Pro Tips Box */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
              <p className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                <span>💡</span>
                <span>Mẹo thực hành chuyên nghiệp</span>
              </p>
              <p className="text-xs text-blue-800 leading-relaxed font-sans">
                Dùng tab <strong className="font-semibold">Kế hoạch EXPLAIN</strong> sau khi chạy câu lệnh để xem cách cơ sở dữ liệu xử lý JOIN, quét dữ liệu (SCAN) và lọc điều kiện WHERE theo thứ tự logic.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-black/[0.06] bg-slate-50/60 backdrop-blur-md flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-[#1D1D1F] text-xs font-semibold transition cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
