import React, { useState } from 'react';
import { ProjectItem } from '../../types/platform';
import { 
  FolderGit2,
  X,
  CheckCircle2 
} from 'lucide-react';
import { ModalPortal } from './ModalPortal';

interface SaveToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  querySql: string;
  projects: ProjectItem[];
  onSave: (projectId: string, queryName: string, sql: string) => void;
}

export const SaveToProjectModal: React.FC<SaveToProjectModalProps> = ({
  isOpen,
  onClose,
  querySql,
  projects,
  onSave,
}) => {
  if (!isOpen) return null;

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [queryName, setQueryName] = useState<string>('query_thuc_hanh.sql');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !queryName.trim()) return;

    onSave(selectedProjectId, queryName.trim(), querySql);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <ModalPortal>
      <div 
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-in fade-in duration-200"
      >
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] border border-black/[0.08] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.06]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#1D1D1F] text-base tracking-tight">Lưu Query vào Dự án</h3>
          </div>
          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#86868B] hover:text-[#1D1D1F] flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSaved ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-center text-emerald-600">
            <CheckCircle2 className="w-12 h-12" />
            <p className="font-bold text-sm">Đã lưu truy vấn vào dự án thành công!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#1D1D1F]">
                Chọn dự án đích *
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full p-3 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.engine})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-[#1D1D1F]">
                Tên file query *
              </label>
              <input
                type="text"
                required
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                placeholder="VD: Doanh_thu_theo_thang.sql"
                className="w-full p-3 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-mono transition"
              />
            </div>

            {/* SQL Preview snippet */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#86868B]">
                Nội dung truy vấn:
              </label>
              <pre className="p-3.5 rounded-2xl bg-[#121316] text-[#64D2FF] font-mono text-[11px] max-h-28 overflow-x-auto border border-white/5">
                <code>{querySql}</code>
              </pre>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-[#86868B] hover:bg-black/[0.05] font-semibold transition active:scale-[0.98]"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full font-semibold bg-[#0071E3] text-white hover:bg-[#0077ED] transition shadow-sm active:scale-[0.98]"
              >
                Lưu vào dự án
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
    </ModalPortal>
  );
};
