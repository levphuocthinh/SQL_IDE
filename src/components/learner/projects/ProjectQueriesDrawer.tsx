import React from 'react';
import { createPortal } from 'react-dom';
import { ProjectItem, ProjectQueryItem } from '../../../types/platform';
import { 
  Database, 
  Plus, 
  Download, 
  X, 
  Play, 
  Copy, 
  Edit3, 
  Trash2, 
  Check 
} from 'lucide-react';

interface ProjectQueriesDrawerProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenAddQuery: (proj: ProjectItem) => void;
  onExportProject: (proj: ProjectItem) => void;
  onRunQuery?: (sql: string) => void;
  onOpenEditQuery: (projectId: string, q: ProjectQueryItem) => void;
  onOpenDeleteQuery: (projectId: string, q: ProjectQueryItem) => void;
  onCopyQuery: (queryId: string, sqlText: string) => void;
  copiedQueryId: string | null;
}

/**
 * Ngăn kéo / Modal xem chi tiết danh sách câu truy vấn (.sql) trong một dự án
 * Cho phép chạy ngay truy vấn vào IDE, sửa, xóa, sao chép hoặc xuất toàn bộ file dự án
 */
export const ProjectQueriesDrawer: React.FC<ProjectQueriesDrawerProps> = ({
  project,
  onClose,
  onOpenAddQuery,
  onExportProject,
  onRunQuery,
  onOpenEditQuery,
  onOpenDeleteQuery,
  onCopyQuery,
  copiedQueryId,
}) => {
  if (!project || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md animate-in fade-in duration-200 flex items-center justify-center p-4 font-sans">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-[0_24px_70px_rgba(0,0,0,0.25)] border border-black/[0.08] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-black/[0.06] flex items-center justify-between bg-slate-50/70 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-3 py-0.5 rounded-full border border-[#0071E3]/20 flex items-center space-x-1">
                <Database className="w-3 h-3 text-[#0071E3]" />
                <span>{project.engine}</span>
              </span>
              <span className="text-xs text-[#86868B] font-medium">
                {project.queries.length} câu truy vấn đã lưu
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">{project.title}</h2>
            {project.description && (
              <p className="text-xs text-[#86868B] max-w-xl">{project.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenAddQuery(project)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#0071E3] text-white hover:bg-[#0077ED] text-xs font-semibold transition active:scale-95 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm truy vấn</span>
            </button>
            <button
              onClick={() => onExportProject(project)}
              title="Xuất toàn bộ truy vấn ra file .sql"
              className="p-2 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#1D1D1F] transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#86868B] hover:text-[#1D1D1F] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Queries List Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {project.queries.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Database className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#1D1D1F]">Chưa có câu truy vấn nào</p>
              <p className="text-xs text-[#86868B]">Bấm nút "+ Thêm truy vấn" bên trên để tạo câu lệnh SQL đầu tiên cho dự án này.</p>
              <button
                onClick={() => onOpenAddQuery(project)}
                className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#0071E3] text-white text-xs font-semibold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm ngay</span>
              </button>
            </div>
          ) : (
            project.queries.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 border border-black/[0.06] hover:border-black/[0.12] transition shadow-xs space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#1D1D1F] font-mono group-hover:text-[#0071E3] transition">
                      {q.name}
                    </h4>
                    <span className="text-[11px] text-[#86868B]">
                      Lần chạy gần nhất: {q.lastRun || 'Chưa chạy'} • {q.rowCount || 0} dòng kết quả
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {onRunQuery && (
                      <button
                        onClick={() => {
                          onRunQuery(q.sql);
                          onClose();
                        }}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-blue-50 text-[#0071E3] hover:bg-blue-100 text-xs font-semibold transition active:scale-95 cursor-pointer"
                        title="Nạp vào IDE và chạy ngay"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Chạy</span>
                      </button>
                    )}

                    <button
                      onClick={() => onCopyQuery(q.id, q.sql)}
                      title="Sao chép câu lệnh SQL"
                      className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                    >
                      {copiedQueryId === q.id ? (
                        <Check className="w-3.5 h-3.5 text-[#34C759]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => onOpenEditQuery(project.id, q)}
                      title="Chỉnh sửa câu lệnh SQL"
                      className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenDeleteQuery(project.id, q)}
                      title="Xóa câu truy vấn này"
                      className="p-1.5 rounded-full text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* SQL Code Block */}
                <pre className="p-3.5 rounded-xl bg-[#0E131F] text-slate-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {q.sql}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
