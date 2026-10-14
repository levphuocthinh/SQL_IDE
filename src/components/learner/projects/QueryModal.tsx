import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProjectQueryItem } from '../../../types/platform';
import { Code2, Edit3, X } from 'lucide-react';

interface QueryModalProps {
  isOpen: boolean;
  queryToEdit: { projectId: string; query: ProjectQueryItem } | null;
  onClose: () => void;
  onSubmit: (name: string, sql: string) => void;
}

/**
 * Modal thêm mới hoặc chỉnh sửa file truy vấn SQL (.sql) trong dự án
 */
export const QueryModal: React.FC<QueryModalProps> = ({
  isOpen,
  queryToEdit,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(queryToEdit);

  const [name, setName] = useState('');
  const [sql, setSql] = useState('');

  useEffect(() => {
    if (queryToEdit) {
      setName(queryToEdit.query.name);
      setSql(queryToEdit.query.sql);
    } else {
      setName('');
      setSql('SELECT * FROM employees LIMIT 10;');
    }
  }, [queryToEdit, isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sql.trim()) return;

    let finalName = name.trim();
    if (!finalName.endsWith('.sql')) finalName += '.sql';

    onSubmit(finalName, sql.trim());
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-md animate-in fade-in duration-200 flex items-center justify-center p-4 font-sans">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-xl w-full p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)] border border-black/[0.08] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-[#1D1D1F] text-base tracking-tight">
                {isEditing ? 'Chỉnh sửa file truy vấn SQL' : 'Thêm file truy vấn SQL mới'}
              </h3>
              <p className="text-[11px] text-[#86868B]">
                {isEditing ? 'Cập nhật tên file hoặc câu lệnh SQL' : 'Lưu trữ câu lệnh để chạy lại bất cứ lúc nào'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#86868B] hover:text-[#1D1D1F] flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1D1D1F]">
              Tên file truy vấn (.sql) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: monthly_revenue.sql..."
              className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-mono font-medium transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1D1D1F]">
              Nội dung câu lệnh SQL *
            </label>
            <textarea
              required
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="SELECT * FROM ..."
              rows={8}
              className="w-full text-xs p-4 rounded-2xl border border-black/[0.08] bg-[#0E131F] text-slate-100 font-mono focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 transition resize-none leading-relaxed"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#86868B] hover:bg-black/[0.05] transition active:scale-[0.98] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0071E3] text-white hover:bg-[#0077ED] transition shadow-sm active:scale-[0.98] cursor-pointer"
            >
              {isEditing ? 'Lưu thay đổi' : 'Thêm file'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
