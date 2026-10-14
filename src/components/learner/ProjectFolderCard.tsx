import React, { useState, useRef, useEffect } from 'react';
import { ProjectItem } from '../../types/platform';
import { 
  Database,
  MoreHorizontal,
  CheckSquare,
  ArrowUpRight,
  Settings,
  Clock,
  Edit3,
  Copy,
  Plus,
  Download,
  Trash2 
} from 'lucide-react';

interface ProjectFolderCardProps {
  project: ProjectItem;
  onOpenProject: (project: ProjectItem) => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (project: ProjectItem) => void;
  onDuplicateProject: (id: string) => void;
  onAddQuery: (project: ProjectItem) => void;
  onExportProject: (project: ProjectItem) => void;
}

export const ProjectFolderCardComponent: React.FC<ProjectFolderCardProps> = ({
  project,
  onOpenProject,
  onEditProject,
  onDeleteProject,
  onDuplicateProject,
  onAddQuery,
  onExportProject,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div 
      className="group relative cursor-pointer pt-8 pb-2 select-none touch-manipulation"
    >
      {/* Container with 3D perspective and hover lift */}
      <div 
        onClick={() => onOpenProject(project)}
        className="relative w-full h-[260px] transform-gpu will-change-transform transition-transform duration-300 ease-out group-hover:-translate-y-2.5"
      >
        
        {/* ======================================================== */}
        {/* 1. BACK FOLDER LAYER (macOS Cupertino Folder Back)       */}
        {/* ======================================================== */}
        <div className="absolute inset-x-0 bottom-0 top-3 rounded-3xl bg-gradient-to-br from-[#0058BA] via-[#0066CC] to-[#00479E] shadow-md z-0 overflow-hidden border border-white/15">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
        </div>

        {/* Top-Left Folder Tab */}
        <div className="absolute top-0 left-0 w-36 h-7 bg-gradient-to-r from-[#0058BA] to-[#0071E3] rounded-t-2xl z-0 shadow-sm border-t border-l border-white/25">
          <div className="w-full h-full flex items-center px-3.5">
            <span className="w-2 h-2 rounded-full bg-blue-200/50" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. SLIDING WHITE PAPER SHEET (macOS Document Paper)      */}
        {/* ======================================================== */}
        <div 
          className="absolute inset-x-3.5 bottom-6 top-1 bg-white rounded-2xl shadow-xl border border-black/[0.04] p-4 z-10 flex flex-col justify-between transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) transform translate-y-3 scale-[0.96] opacity-95 group-hover:-translate-y-12 group-hover:scale-100 group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)] group-hover:opacity-100"
        >
          {/* Paper Header: Date pill & Options */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.04]">
              <div className="flex items-center space-x-1.5 bg-black/[0.03] px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#86868B] font-semibold">
                <Clock className="w-2.5 h-2.5 text-[#0071E3]" />
                <span>{project.updatedAt}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                title="Tùy chọn thư mục"
                className="text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] rounded-full p-1 transition"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Checklist of SQL Files */}
            <div className="mt-2.5 space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
                SQL FILES IN PROJECT
              </div>

              {project.queries.slice(0, 3).map((q, idx) => (
                <div key={q.id || idx} className="flex items-center space-x-2 text-xs font-mono text-[#1D1D1F]">
                  <CheckSquare className="w-3.5 h-3.5 text-[#0071E3] flex-shrink-0" />
                  <span className="truncate text-[11px] font-medium">{q.name}</span>
                </div>
              ))}

              {project.queries.length > 3 && (
                <div className="text-[10px] text-[#0071E3] font-semibold pl-5 pt-0.5">
                  + {project.queries.length - 3} file khác...
                </div>
              )}

              {project.queries.length === 0 && (
                <div className="text-xs text-[#86868B] italic py-1">
                  Chưa có query nào được lưu
                </div>
              )}
            </div>
          </div>

          {/* Paper Footer Hint */}
          <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#86868B]">{project.engine}</span>
            <span className="text-[#0071E3] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Xem chi tiết <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. FRONT FOLDER FLAP (macOS Front Cover with Glow)      */}
        {/* ======================================================== */}
        <div 
          className="absolute inset-x-0 bottom-0 h-44 rounded-3xl bg-gradient-to-b from-[#2E93FF] via-[#0071E3] to-[#0058BA] shadow-[0_12px_32px_rgba(0,113,227,0.3)] p-5 z-20 flex flex-col justify-between border-t border-white/35 backdrop-blur-md transition-all duration-500 ease-out group-hover:translate-y-1.5 group-hover:shadow-[0_16px_40px_rgba(0,113,227,0.4)]"
        >
          {/* Top row: Project Title & Quick Icons */}
          <div className="flex items-start justify-between">
            <div className="space-y-0.5 pr-2">
              <h3 className="text-white font-bold text-base tracking-tight truncate drop-shadow-sm">
                {project.title}
              </h3>
              <p className="text-white/80 text-xs font-medium">
                {project.queryCount} queries · {project.updatedAt}
              </p>
            </div>

            {/* Folder action icons */}
            <div className="flex items-center space-x-1.5 text-white/90">
              <div 
                title={`Database Engine: ${project.engine}`}
                className="w-7 h-7 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition border border-white/20 shadow-sm"
              >
                <Database className="w-3.5 h-3.5 text-white" />
              </div>

              {/* Settings / Options Dropdown Trigger Button */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  title="Cài đặt & Tùy chọn dự án"
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition border border-white/20 shadow-sm ${
                    showMenu ? 'bg-white text-[#0071E3] shadow-md' : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                >
                  <Settings className={`w-3.5 h-3.5 ${showMenu ? 'animate-spin' : ''}`} />
                </button>

                {/* macOS Frosted Context Menu */}
                {showMenu && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-9 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.18)] border border-black/[0.08] p-1.5 z-50 text-[#1D1D1F] text-xs font-sans animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-1.5 border-b border-black/[0.04] text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">
                      Cài đặt thư mục
                    </div>

                    {/* 1. Sửa dự án */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onEditProject(project);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left hover:bg-[#0071E3]/10 hover:text-[#0071E3] flex items-center space-x-2.5 transition font-semibold"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>Chỉnh sửa thông tin</span>
                    </button>

                    {/* 2. Thêm file query */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onAddQuery(project);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left hover:bg-emerald-500/10 hover:text-emerald-600 flex items-center space-x-2.5 transition font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Thêm file Query mới</span>
                    </button>

                    {/* 3. Nhân bản */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDuplicateProject(project.id);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left hover:bg-[#0071E3]/10 hover:text-[#0071E3] flex items-center space-x-2.5 transition font-semibold"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>Nhân bản thư mục</span>
                    </button>

                    {/* 4. Xuất file SQL */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onExportProject(project);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left hover:bg-amber-500/10 hover:text-amber-600 flex items-center space-x-2.5 transition font-semibold"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-500" />
                      <span>Xuất toàn bộ SQL (.sql)</span>
                    </button>

                    <div className="my-1 border-t border-black/[0.04]" />

                    {/* 5. Xóa dự án */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        onDeleteProject(project);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left hover:bg-rose-50 text-rose-600 flex items-center space-x-2.5 transition font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Xóa thư mục dự án</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom row: Engine Tag & Open Button */}
          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white border border-white/25 shadow-sm">
              {project.engine}
            </span>

            <div className="flex items-center space-x-1 text-white text-xs font-semibold group-hover:text-blue-100 transition">
              <span>Mở dự án</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const ProjectFolderCard = React.memo(ProjectFolderCardComponent);
