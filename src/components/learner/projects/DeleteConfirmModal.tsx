import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}

/**
 * Modal xác nhận thao tác xóa dữ liệu (Dự án hoặc File truy vấn SQL)
 * Cảnh báo người dùng trước khi thực hiện xóa vĩnh viễn
 */
export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemName,
  message,
  onClose,
  onConfirm,
  confirmLabel = 'Xóa vĩnh viễn',
}) => {
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-md animate-in fade-in duration-200 flex items-center justify-center p-4 font-sans">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)] border border-black/[0.08] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center space-x-3.5 pb-4 border-b border-black/[0.06]">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[#1D1D1F] text-base tracking-tight">{title}</h3>
            <p className="text-[11px] text-[#86868B]">Hành động này không thể hoàn tác</p>
          </div>
        </div>

        <div className="py-4 space-y-2">
          <p className="text-xs text-slate-600 leading-relaxed">
            {message || `Bạn có chắc chắn muốn xóa vĩnh viễn:`}
          </p>
          <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 font-mono text-xs text-rose-900 font-bold truncate">
            {itemName}
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end space-x-2 border-t border-black/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#86868B] hover:bg-black/[0.05] transition active:scale-95 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 rounded-full text-xs font-bold bg-[#FF3B30] text-white hover:bg-rose-600 transition shadow-sm active:scale-95 flex items-center space-x-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
