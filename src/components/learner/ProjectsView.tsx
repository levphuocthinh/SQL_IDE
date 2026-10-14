import React, { useState } from 'react';
import { ProjectItem, ProjectQueryItem } from '../../types/platform';
import { ProjectFolderCard } from './ProjectFolderCard';
import { 
  FolderGit2, 
  Plus, 
  CheckCircle2 
} from 'lucide-react';

// Subcomponents
import { ProjectModal } from './projects/ProjectModal';
import { QueryModal } from './projects/QueryModal';
import { DeleteConfirmModal } from './projects/DeleteConfirmModal';
import { ProjectQueriesDrawer } from './projects/ProjectQueriesDrawer';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onCreateProject: (title: string, description: string, engine: 'PostgreSQL' | 'MySQL' | 'SQLite') => void;
  onUpdateProject?: (id: string, updated: Partial<ProjectItem>) => void;
  onDeleteProject?: (id: string) => void;
  onDuplicateProject?: (id: string) => void;
  onAddQuery?: (projectId: string, queryName: string, sql: string) => void;
  onDeleteQuery?: (projectId: string, queryId: string) => void;
  onUpdateQuery?: (projectId: string, queryId: string, updated: Partial<ProjectQueryItem>) => void;
  onRunProjectQuery?: (sql: string) => void;
  isMaintenance?: boolean;
  onTriggerMaintenance?: (feature?: string, description?: string) => void;
}

/**
 * Màn hình Thư viện Quản lý Dự án & Truy vấn SQL (Projects View)
 * Đóng vai trò là Điều phối viên (Coordinator):
 * - Hiển thị lưới thẻ thư mục dự án phong cách Finder macOS (ProjectFolderCard)
 * - Mở ngăn kéo chi tiết các file .sql (ProjectQueriesDrawer)
 * - Tạo/sửa dự án (ProjectModal)
 * - Thêm/sửa truy vấn SQL (QueryModal)
 * - Xác nhận xóa an toàn (DeleteConfirmModal)
 */
export const ProjectsViewComponent: React.FC<ProjectsViewProps> = ({
  projects,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
  onAddQuery,
  onDeleteQuery,
  onUpdateQuery,
  onRunProjectQuery,
  isMaintenance = false,
  onTriggerMaintenance,
}) => {
  // Modal states
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectItem | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);

  const [queryModalState, setQueryModalState] = useState<{
    isOpen: boolean;
    projectId: string | null;
    queryToEdit: { projectId: string; query: ProjectQueryItem } | null;
  }>({ isOpen: false, projectId: null, queryToEdit: null });

  const [deletingQuery, setDeletingQuery] = useState<{ projectId: string; query: ProjectQueryItem } | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ========================================================
  // Xử lý Dự án (Projects)
  // ========================================================
  const handleOpenCreateProject = () => {
    if (isMaintenance) {
      onTriggerMaintenance?.('Tạo thư mục dự án mới');
      return;
    }
    setProjectToEdit(null);
    setShowProjectModal(true);
  };

  const handleOpenEditProject = (proj: ProjectItem) => {
    if (isMaintenance) {
      onTriggerMaintenance?.(`Chỉnh sửa dự án: ${proj.title}`);
      return;
    }
    setProjectToEdit(proj);
    setShowProjectModal(true);
  };

  const handleProjectModalSubmit = (
    title: string, 
    description: string, 
    engine: 'PostgreSQL' | 'MySQL' | 'SQLite', 
    notes?: string
  ) => {
    if (projectToEdit) {
      // Cập nhật dự án hiện có
      onUpdateProject?.(projectToEdit.id, { title, description, engine, notes });
      if (selectedProject && selectedProject.id === projectToEdit.id) {
        setSelectedProject(prev => prev ? { ...prev, title, description, engine, notes: notes || '' } : null);
      }
      showToast(`✓ Đã cập nhật thông tin dự án "${title}"!`);
    } else {
      // Tạo dự án mới
      onCreateProject(title, description, engine);
      showToast(`✓ Đã tạo thư mục dự án "${title}" thành công!`);
    }
    setShowProjectModal(false);
    setProjectToEdit(null);
  };

  const handleConfirmDeleteProject = () => {
    if (!deletingProject) return;
    const title = deletingProject.title;
    onDeleteProject?.(deletingProject.id);

    if (selectedProject && selectedProject.id === deletingProject.id) {
      setSelectedProject(null);
    }
    setDeletingProject(null);
    showToast(`✓ Đã xóa vĩnh viễn thư mục dự án "${title}"!`);
  };

  const handleDuplicate = (id: string) => {
    if (isMaintenance) {
      onTriggerMaintenance?.('Nhân bản dự án');
      return;
    }
    onDuplicateProject?.(id);
    showToast('✓ Đã nhân bản thư mục dự án thành công!');
  };

  const handleExportProject = (proj: ProjectItem) => {
    if (isMaintenance) {
      onTriggerMaintenance?.('Xuất file dự án');
      return;
    }
    if (proj.queries.length === 0) {
      showToast('Thư mục này chưa có câu truy vấn nào để xuất.');
      return;
    }

    let bundle = `-- SQLFlow Project Export: ${proj.title}\n`;
    bundle += `-- Database Engine: ${proj.engine}\n`;
    bundle += `-- Export Date: ${new Date().toLocaleString('vi-VN')}\n`;
    bundle += `-- Total Queries: ${proj.queries.length}\n`;
    bundle += `-- Description: ${proj.description || 'N/A'}\n\n`;

    proj.queries.forEach((q, idx) => {
      bundle += `------------------------------------------------------------\n`;
      bundle += `-- File [${idx + 1}/${proj.queries.length}]: ${q.name}\n`;
      bundle += `------------------------------------------------------------\n`;
      bundle += `${q.sql.trim()};\n\n`;
    });

    const blob = new Blob([bundle], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${proj.title.toLowerCase().replace(/\s+/g, '_')}_export.sql`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`✓ Đã xuất file SQL cho dự án "${proj.title}"!`);
  };

  // ========================================================
  // Xử lý File Truy vấn SQL trong Dự án (Queries)
  // ========================================================
  const handleOpenAddQuery = (proj: ProjectItem) => {
    if (isMaintenance) {
      onTriggerMaintenance?.('Thêm file truy vấn vào dự án');
      return;
    }
    setQueryModalState({
      isOpen: true,
      projectId: proj.id,
      queryToEdit: null,
    });
  };

  const handleOpenEditQuery = (projectId: string, q: ProjectQueryItem) => {
    setQueryModalState({
      isOpen: true,
      projectId,
      queryToEdit: { projectId, query: q },
    });
  };

  const handleQueryModalSubmit = (finalName: string, sql: string) => {
    const { projectId, queryToEdit } = queryModalState;
    if (!projectId) return;

    if (queryToEdit) {
      // Cập nhật câu truy vấn
      onUpdateQuery?.(projectId, queryToEdit.query.id, { name: finalName, sql });
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(prev => prev ? {
          ...prev,
          queries: prev.queries.map(q => q.id === queryToEdit.query.id ? { ...q, name: finalName, sql, lastRun: 'Vừa sửa' } : q),
        } : null);
      }
      showToast(`✓ Đã lưu thay đổi cho file "${finalName}"!`);
    } else {
      // Thêm câu truy vấn mới
      onAddQuery?.(projectId, finalName, sql);
      if (selectedProject && selectedProject.id === projectId) {
        const newQueryItem: ProjectQueryItem = {
          id: `q-${Date.now()}`,
          name: finalName,
          sql,
          lastRun: 'Vừa xong',
          rowCount: 0,
        };
        setSelectedProject(prev => prev ? {
          ...prev,
          queryCount: prev.queryCount + 1,
          queries: [newQueryItem, ...prev.queries],
        } : null);
      }
      showToast(`✓ Đã thêm file query "${finalName}" vào dự án!`);
    }

    setQueryModalState({ isOpen: false, projectId: null, queryToEdit: null });
  };

  const handleConfirmDeleteQuery = () => {
    if (!deletingQuery) return;
    const { projectId, query } = deletingQuery;
    onDeleteQuery?.(projectId, query.id);

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => prev ? {
        ...prev,
        queryCount: Math.max(0, prev.queryCount - 1),
        queries: prev.queries.filter(q => q.id !== query.id),
      } : null);
    }

    setDeletingQuery(null);
    showToast(`✓ Đã xóa file "${query.name}" khỏi dự án!`);
  };

  const handleCopyQuery = (queryId: string, sqlText: string) => {
    navigator.clipboard.writeText(sqlText);
    setCopiedQueryId(queryId);
    setTimeout(() => setCopiedQueryId(null), 1800);
  };

  const liveSelectedProject = selectedProject 
    ? projects.find(p => p.id === selectedProject.id) || selectedProject 
    : null;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto overflow-y-auto relative font-sans">
      
      {/* Toast Notification Banner (macOS Style Pill) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1D1F]/90 backdrop-blur-xl text-white px-5 py-3 rounded-full shadow-[0_16px_36px_rgba(0,0,0,0.25)] border border-white/10 flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Finder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-3 py-1 rounded-full border border-[#0071E3]/15">
              Finder & Thư viện Cá nhân
            </span>
            <span className="text-xs text-[#86868B] font-medium">
              {projects.length} thư mục dự án
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Dự án SQL & Kho Truy Vấn
          </h1>
          <p className="text-xs md:text-sm text-[#86868B] max-w-2xl">
            Tổ chức các câu truy vấn phức tạp theo từng bài toán thực tế.
          </p>
        </div>

        <button
          onClick={handleOpenCreateProject}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo thư mục mới</span>
        </button>
      </div>

      {/* 2. Lưới thư mục Dự án (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <ProjectFolderCard
            key={proj.id}
            project={proj}
            onOpenProject={(p) => {
              if (isMaintenance) {
                onTriggerMaintenance?.(
                  `Chi tiết dự án: ${p.title}`,
                  'Chức năng xem và quản lý danh sách file truy vấn bên trong dự án đang tạm khóa để bảo trì nâng cấp hệ thống.'
                );
                return;
              }
              setSelectedProject(p);
            }}
            onEditProject={(p) => handleOpenEditProject(p)}
            onDeleteProject={(p) => {
              if (isMaintenance) {
                onTriggerMaintenance?.(`Xóa dự án: ${p.title}`);
                return;
              }
              setDeletingProject(p);
            }}
            onDuplicateProject={(id) => {
              if (isMaintenance) {
                onTriggerMaintenance?.('Nhân bản dự án');
                return;
              }
              handleDuplicate(id);
            }}
            onExportProject={(p) => {
              if (isMaintenance) {
                onTriggerMaintenance?.('Xuất file dự án');
                return;
              }
              handleExportProject(p);
            }}
            onAddQuery={(p) => {
              if (isMaintenance) {
                onTriggerMaintenance?.('Thêm file truy vấn vào dự án');
                return;
              }
              handleOpenAddQuery(p);
            }}
          />
        ))}

        {/* Thẻ tạo nhanh thư mục */}
        <div 
          onClick={handleOpenCreateProject}
          className="h-64 rounded-3xl border-2 border-dashed border-black/[0.1] hover:border-[#0071E3]/50 bg-black/[0.01] hover:bg-[#0071E3]/[0.02] flex flex-col items-center justify-center space-y-3 cursor-pointer transition group"
        >
          <div className="w-12 h-12 rounded-2xl bg-black/[0.04] group-hover:bg-[#0071E3]/10 text-slate-400 group-hover:text-[#0071E3] flex items-center justify-center transition">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition">
              Tạo thư mục dự án mới
            </p>
            <p className="text-xs text-[#86868B]">
              Lưu trữ và phân loại các câu lệnh SQL
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MODAL: Xem chi tiết các truy vấn trong Dự án          */}
      {/* ======================================================== */}
      <ProjectQueriesDrawer
        project={liveSelectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenAddQuery={handleOpenAddQuery}
        onExportProject={handleExportProject}
        onRunQuery={onRunProjectQuery}
        onOpenEditQuery={handleOpenEditQuery}
        onOpenDeleteQuery={(projectId, q) => setDeletingQuery({ projectId, query: q })}
        onCopyQuery={handleCopyQuery}
        copiedQueryId={copiedQueryId}
      />

      {/* ======================================================== */}
      {/* 4. MODAL: Tạo mới hoặc Chỉnh sửa Dự án                   */}
      {/* ======================================================== */}
      <ProjectModal
        isOpen={showProjectModal}
        projectToEdit={projectToEdit}
        onClose={() => {
          setShowProjectModal(false);
          setProjectToEdit(null);
        }}
        onSubmit={handleProjectModalSubmit}
      />

      {/* ======================================================== */}
      {/* 5. MODAL: Thêm mới hoặc Chỉnh sửa File Truy vấn SQL      */}
      {/* ======================================================== */}
      <QueryModal
        isOpen={queryModalState.isOpen}
        queryToEdit={queryModalState.queryToEdit}
        onClose={() => setQueryModalState({ isOpen: false, projectId: null, queryToEdit: null })}
        onSubmit={handleQueryModalSubmit}
      />

      {/* ======================================================== */}
      {/* 6. MODAL: Xác nhận xóa Thư mục Dự án                    */}
      {/* ======================================================== */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProject)}
        title="Xóa thư mục dự án"
        itemName={deletingProject?.title || ''}
        message="Bạn có chắc chắn muốn xóa toàn bộ thư mục dự án này cùng toàn bộ các câu truy vấn bên trong không?"
        onClose={() => setDeletingProject(null)}
        onConfirm={handleConfirmDeleteProject}
        confirmLabel="Xóa dự án"
      />

      {/* ======================================================== */}
      {/* 7. MODAL: Xác nhận xóa File Truy vấn SQL                 */}
      {/* ======================================================== */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingQuery)}
        title="Xóa file truy vấn SQL"
        itemName={deletingQuery?.query.name || ''}
        message="Bạn có chắc chắn muốn xóa file truy vấn này khỏi dự án không?"
        onClose={() => setDeletingQuery(null)}
        onConfirm={handleConfirmDeleteQuery}
        confirmLabel="Xóa file"
      />
    </div>
  );
};

export const ProjectsView = React.memo(ProjectsViewComponent);
