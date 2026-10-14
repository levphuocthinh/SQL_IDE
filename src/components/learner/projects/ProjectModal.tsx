import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProjectItem } from '../../../types/platform';
import { FolderGit2, Edit3, X } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  projectToEdit: ProjectItem | null;
  onClose: () => void;
  onSubmit: (title: string, description: string, engine: 'PostgreSQL' | 'MySQL' | 'SQLite', notes?: string) => void;
}

/**
 * Modal tạo mới hoặc chỉnh sửa thư mục dự án SQL
 * Hỗ trợ chọn Database Engine (PostgreSQL, MySQL, SQLite), tên và mô tả dự án
 */
export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  projectToEdit,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(projectToEdit);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [engine, setEngine] = useState<'PostgreSQL' | 'MySQL' | 'SQLite'>('PostgreSQL');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description || '');
      setEngine(projectToEdit.engine);
      setNotes(projectToEdit.notes || '');
    } else {
      setTitle('');
      setDescription('');
      setEngine('PostgreSQL');
      setNotes('');
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim(), engine, notes.trim());
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md animate-in fade-in duration-200 flex items-center justify-center p-4 font-sans">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] border border-black/[0.08] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <FolderGit2 className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-[#1D1D1F] text-base tracking-tight">
                {isEditing ? 'Chỉnh sửa thông tin dự án' : 'Tạo thư mục dự án mới'}
              </h3>
              <p className="text-[11px] text-[#86868B]">
                {isEditing ? 'Cập nhật cấu hình và ghi chú dự án' : 'Khởi tạo không gian lưu trữ các câu truy vấn SQL'}
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
              Tên thư mục dự án *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Phân tích doanh số bán hàng..."
              className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1D1D1F]">
              Mô tả dự án
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả mục tiêu, nguồn dữ liệu và các câu hỏi cần trả lời..."
              rows={3}
              className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1D1D1F]">
              Database Engine
            </label>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value as any)}
              className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition cursor-pointer"
            >
              <option value="PostgreSQL">PostgreSQL 16 (Chuẩn doanh nghiệp)</option>
              <option value="MySQL">MySQL 8.0</option>
              <option value="SQLite">SQLite 3 (Nhẹ & Nhanh)</option>
            </select>
          </div>

          {isEditing && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1D1D1F]">
                Ghi chú kiến trúc CSDL (Notes)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú về khóa ngoại, bảng index..."
                rows={2}
                className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition resize-none"
              />
            </div>
          )}

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
              {isEditing ? 'Lưu thay đổi' : 'Tạo thư mục'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
