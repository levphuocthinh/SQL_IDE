import React, { useState, useCallback, Suspense, lazy } from 'react';
import {
  UserProfile,
  AppNavTab,
  CourseItem,
  ProjectItem,
  ProjectQueryItem,
  StudentManagementItem,
  AuditLogItem,
} from '../../types/platform';
import { MaintenanceSettings } from '../../config/maintenance';
import { SQLEngine } from '../../engine/sqlEngine';

// Components Layout
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { WorkspaceMaintenanceBanner } from '../../components/common/WorkspaceMaintenanceBanner';

// Views - Nạp trực tiếp OverviewView để hiển thị ngay tức thì
import { OverviewView } from '../../components/learner/OverviewView';

// Code-splitting lazy views
const PracticeView = lazy(() =>
  import('../../components/learner/PracticeView').then(m => ({ default: m.PracticeView }))
);
const CoursesView = lazy(() =>
  import('../../components/learner/CoursesView').then(m => ({ default: m.CoursesView }))
);
const ProjectsView = lazy(() =>
  import('../../components/learner/ProjectsView').then(m => ({ default: m.ProjectsView }))
);
const ProfileView = lazy(() =>
  import('../../components/learner/ProfileView').then(m => ({ default: m.ProfileView }))
);

// Admin Views
const AdminDashboardView = lazy(() =>
  import('../../components/admin/AdminDashboardView').then(m => ({ default: m.AdminDashboardView }))
);
const StudentsManagementView = lazy(() =>
  import('../../components/admin/StudentsManagementView').then(m => ({
    default: m.StudentsManagementView,
  }))
);
const CoursesManagementView = lazy(() =>
  import('../../components/admin/CoursesManagementView').then(m => ({
    default: m.CoursesManagementView,
  }))
);
const ExercisesManagementView = lazy(() =>
  import('../../components/admin/ExercisesManagementView').then(m => ({
    default: m.ExercisesManagementView,
  }))
);
const RolesManagementView = lazy(() =>
  import('../../components/admin/RolesManagementView').then(m => ({
    default: m.RolesManagementView,
  }))
);
const AuditLogsView = lazy(() =>
  import('../../components/admin/AuditLogsView').then(m => ({ default: m.AuditLogsView }))
);

// Modals
import { AuthModal } from '../../components/auth/AuthModal';
import { SaveToProjectModal } from '../../components/common/SaveToProjectModal';
import { SchemaModal } from '../../components/common/SchemaModal';
import { MaintenanceModal } from '../../components/common/MaintenanceModal';

const ViewFallback: React.FC = () => (
  <div className="w-full h-full min-h-[450px] flex flex-col items-center justify-center p-8 text-slate-500 font-sans">
    <div className="w-9 h-9 rounded-full border-[2.5px] border-slate-200 border-t-[#0284C7] animate-spin mb-3 shadow-xs" />
    <span className="text-xs font-semibold text-slate-600 tracking-wide">
      Đang tải không gian làm việc...
    </span>
  </div>
);

export interface WorkspaceModuleProps {
  activeTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  currentUser: UserProfile;
  onToggleRole: () => void;
  onLogout: () => void;
  isGuest: boolean;
  isWorkspaceDemo: boolean;
  onOpenLandingPage: () => void;
  onOpenSql: () => void;
  onOpenLogin: () => void;
  onAuthSuccess: (user: UserProfile) => void;

  // Dữ liệu nền tảng
  courses: CourseItem[];
  projects: ProjectItem[];
  students: StudentManagementItem[];
  auditLogs: AuditLogItem[];
  companyEngine: SQLEngine;

  // Cấu hình bảo trì
  maintenanceSettings: MaintenanceSettings;
  onTogglePageMaintenance: (pageId: keyof MaintenanceSettings, enabled?: boolean) => void;
  onSetAllMaintenance: (enable: boolean) => void;
  onTriggerMaintenance: (featureName?: string, description?: string, title?: string) => void;
  maintenanceModalState: {
    isOpen: boolean;
    featureName?: string;
    title?: string;
    description?: string;
  };
  onCloseMaintenance: () => void;

  // Nghiệp vụ Dự án
  onCreateProject: (title: string, description: string, engine: 'PostgreSQL' | 'MySQL' | 'SQLite') => void;
  onUpdateProject: (id: string, updates: Partial<ProjectItem>) => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onSaveQueryToProject: (projectId: string, queryTitle: string, sql: string) => void;
  onDeleteQueryFromProject: (projectId: string, queryId: string) => void;
  onUpdateQueryInProject: (projectId: string, queryId: string, updates: Partial<ProjectQueryItem>) => void;

  // Nghiệp vụ Học viên & Quản trị
  onToggleBlockStudent: (studentId: string) => void;
  onResetPasswordStudent: (studentId: string) => void;
  onAddSupportNote: (studentId: string, noteContent: string) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onAddCourse: (course: CourseItem) => void;
  onCompleteExercise: () => void;
  onLogAudit: (action: string, target: string, status?: 'success' | 'warning' | 'danger') => void;
}

/**
 * ============================================================================
 * MODULE: WorkspaceModule
 * ============================================================================
 * Đóng gói toàn bộ cấu trúc Không Gian Học Tập & Quản Trị Hệ Thống (Workspace):
 * 1. Sidebar điều hướng trái linh hoạt (thu gọn / mở rộng).
 * 2. Header phía trên hỗ trợ chuyển vai trò Học viên <-> Quản trị viên.
 * 3. Banner thông báo Chế độ Xem Demo (Read-Only) khi bảo trì.
 * 4. Router điều hướng hiển thị các Tab Học viên & Quản trị viên.
 * 5. Các Modal dùng chung: Schema Modal, Lưu Query vào Project, Đăng nhập, Modal Bảo Trì.
 */
export const WorkspaceModule: React.FC<WorkspaceModuleProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onToggleRole,
  onLogout,
  isGuest,
  isWorkspaceDemo,
  onOpenLandingPage,
  onOpenSql,
  onOpenLogin,
  onAuthSuccess,
  courses,
  projects,
  students,
  auditLogs,
  companyEngine,
  maintenanceSettings,
  onTogglePageMaintenance,
  onSetAllMaintenance,
  onTriggerMaintenance,
  maintenanceModalState,
  onCloseMaintenance,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
  onSaveQueryToProject,
  onDeleteQueryFromProject,
  onUpdateQueryInProject,
  onToggleBlockStudent,
  onResetPasswordStudent,
  onAddSupportNote,
  onUpdateProfile,
  onAddCourse,
  onCompleteExercise,
  onLogAudit,
}) => {
  // Trạng thái cục bộ của Workspace
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState<boolean>(false);
  const [queryToSave, setQueryToSave] = useState<string | null>(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentManagementItem | null>(null);
  const [ideInitialSql, setIdeInitialSql] = useState<string | null>(null);
  const [ideLessonId, setIdeLessonId] = useState<string | null>(null);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const handleOpenProfile = useCallback(() => {
    if (isGuest) {
      setIsAuthModalOpen(true);
      return;
    }
    onSelectTab('profile');
  }, [isGuest, onSelectTab]);

  const handleStartLesson = useCallback(
    (lessonId?: string) => {
      if (maintenanceSettings.practice) {
        onTriggerMaintenance(
          'Bài học thực hành SQL',
          'Chức năng thực hành và nộp bài tập đang tạm khóa để bảo trì nâng cấp hệ thống.'
        );
        return;
      }
      if (lessonId) {
        setIdeLessonId(lessonId);
      }
      onSelectTab('practice');
    },
    [maintenanceSettings.practice, onSelectTab, onTriggerMaintenance]
  );

  const handleRunProjectQuery = useCallback(
    (sql: string) => {
      if (maintenanceSettings.projects) {
        onTriggerMaintenance(
          'Chạy truy vấn dự án trong thực hành',
          'Chức năng thực thi truy vấn dự án đang tạm khóa để bảo trì nâng cấp hệ thống.'
        );
        return;
      }
      setIdeInitialSql(sql);
      onSelectTab('practice');
    },
    [maintenanceSettings.projects, onSelectTab, onTriggerMaintenance]
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans antialiased text-slate-800">
      {/* 1. Sidebar điều hướng trái */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        currentUser={currentUser}
        onToggleRole={onToggleRole}
        onLogout={onLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        onOpenLandingPage={onOpenLandingPage}
        isWorkspaceDemo={isWorkspaceDemo}
        canToggleRole={currentUser.role === 'super_admin' && !isWorkspaceDemo}
      />

      {/* 2. Khu vực nội dung chính */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {/* Top Header Bar */}
        <Header
          activeTab={activeTab}
          currentUser={currentUser}
          onToggleRole={onToggleRole}
          onOpenProfile={handleOpenProfile}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          isGuest={isGuest}
          isWorkspaceDemo={isWorkspaceDemo}
          canToggleRole={currentUser.role === 'super_admin' && !isWorkspaceDemo}
          onOpenLandingPage={onOpenLandingPage}
          onOpenLogin={onOpenLogin}
        />

        {/* Nội dung tương tác bên dưới Header */}
        <main className="flex-1 overflow-y-auto bg-white scrollbar-thin flex flex-col">
          {/* Banner thông báo Chế độ Xem Demo (Read-Only) khi bảo trì */}
          <WorkspaceMaintenanceBanner
            isVisible={isWorkspaceDemo}
            onOpenMaintenanceModal={() => onTriggerMaintenance('Không gian học SQL')}
            onSwitchToPlayground={onOpenSql}
          />

          <div className="flex-1">
            <Suspense fallback={<ViewFallback />}>
              {/* TAB 1: TỔNG QUAN (OVERVIEW) */}
              {activeTab === 'overview' && (
                <OverviewView
                  user={currentUser}
                  courses={courses}
                  projects={projects}
                  onStartLesson={handleStartLesson}
                  onViewCourses={() => onSelectTab('courses')}
                  onSelectTab={onSelectTab}
                  isMaintenance={maintenanceSettings.workspace}
                  onTriggerMaintenance={onTriggerMaintenance}
                />
              )}

              {/* TAB 2: THỰC HÀNH SQL (PRACTICE) */}
              {activeTab === 'practice' && (
                <PracticeView
                  onSaveToProject={(sql) => {
                    if (isWorkspaceDemo || maintenanceSettings.practice) {
                      onTriggerMaintenance('Lưu câu truy vấn vào dự án');
                      return;
                    }
                    setQueryToSave(sql);
                  }}
                  onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
                  onCompleteExercise={() => {
                    if (isWorkspaceDemo || maintenanceSettings.practice) {
                      onTriggerMaintenance('Chấm điểm bài học tự động');
                      return;
                    }
                    onCompleteExercise();
                  }}
                  initialLessonId={ideLessonId}
                  initialSqlOverride={ideInitialSql}
                  onClearInitialSqlOverride={() => setIdeInitialSql(null)}
                  isDemoReadOnly={isWorkspaceDemo || maintenanceSettings.practice}
                  onTriggerMaintenance={(feature, desc) => onTriggerMaintenance(feature, desc)}
                />
              )}

              {/* TAB 3: KHÓA HỌC (COURSES) */}
              {activeTab === 'courses' && (
                <CoursesView
                  courses={courses}
                  onSelectLesson={handleStartLesson}
                  isMaintenance={maintenanceSettings.courses}
                  onTriggerMaintenance={onTriggerMaintenance}
                />
              )}

              {/* TAB 4: DỰ ÁN CÁ NHÂN (PROJECTS) */}
              {activeTab === 'projects' && (
                <ProjectsView
                  projects={projects}
                  isMaintenance={maintenanceSettings.projects}
                  onTriggerMaintenance={onTriggerMaintenance}
                  onCreateProject={(title, desc, engine) => {
                    if (isWorkspaceDemo || maintenanceSettings.projects) {
                      onTriggerMaintenance('Khởi tạo dự án cá nhân');
                      return;
                    }
                    onCreateProject(title, desc, engine);
                  }}
                  onUpdateProject={onUpdateProject}
                  onDeleteProject={(id) => {
                    if (isWorkspaceDemo || maintenanceSettings.projects) {
                      onTriggerMaintenance('Xóa dự án');
                      return;
                    }
                    onDeleteProject(id);
                  }}
                  onDuplicateProject={(id) => {
                    if (isWorkspaceDemo) {
                      onTriggerMaintenance('Nhân bản dự án');
                      return;
                    }
                    onDuplicateProject(id);
                  }}
                  onDeleteQuery={(projId, queryId) => {
                    if (isWorkspaceDemo) {
                      onTriggerMaintenance('Xóa file truy vấn SQL');
                      return;
                    }
                    onDeleteQueryFromProject(projId, queryId);
                  }}
                  onUpdateQuery={onUpdateQueryInProject}
                  onAddQuery={(projId, qName, qSql) => {
                    if (isWorkspaceDemo) {
                      onTriggerMaintenance('Thêm truy vấn vào dự án');
                      return;
                    }
                    onSaveQueryToProject(projId, qName, qSql);
                  }}
                  onRunProjectQuery={handleRunProjectQuery}
                />
              )}

              {/* TAB 5: HỒ SƠ CÁ NHÂN (PROFILE) */}
              {activeTab === 'profile' && (
                <ProfileView
                  user={currentUser}
                  onUpdateProfile={(updated) => {
                    if (isWorkspaceDemo) {
                      onTriggerMaintenance('Cập nhật hồ sơ cá nhân');
                      return;
                    }
                    onUpdateProfile(updated);
                  }}
                />
              )}

              {/* QUẢN TRỊ 1: TỔNG QUAN HỆ THỐNG */}
              {activeTab === 'admin-dashboard' && currentUser.role === 'super_admin' && (
                <AdminDashboardView
                  students={students}
                  auditLogs={auditLogs}
                  onNavigateToStudents={() => onSelectTab('admin-students')}
                  onNavigateToExercises={() => onSelectTab('admin-exercises')}
                  onNavigateToRoles={() => onSelectTab('admin-roles')}
                  maintenanceSettings={maintenanceSettings}
                  onSelectStudent={(stu) => {
                    setSelectedStudentForDetail(stu);
                    onSelectTab('admin-students');
                  }}
                />
              )}

              {/* QUẢN TRỊ 2: QUẢN LÝ HỌC VIÊN */}
              {activeTab === 'admin-students' && currentUser.role === 'super_admin' && (
                <StudentsManagementView
                  students={students}
                  selectedStudent={selectedStudentForDetail}
                  onSelectStudent={setSelectedStudentForDetail}
                  onToggleBlockStudent={onToggleBlockStudent}
                  onResetPasswordStudent={onResetPasswordStudent}
                  onAddSupportNote={onAddSupportNote}
                />
              )}

              {/* QUẢN TRỊ 3: QUẢN LÝ KHÓA HỌC */}
              {activeTab === 'admin-courses' && currentUser.role === 'super_admin' && (
                <CoursesManagementView
                  courses={courses}
                  onAddCourse={onAddCourse}
                />
              )}

              {/* QUẢN TRỊ 4: QUẢN LÝ BÀI TẬP */}
              {activeTab === 'admin-exercises' && currentUser.role === 'super_admin' && <ExercisesManagementView />}

              {/* QUẢN TRỊ 5: PHÂN QUYỀN & BẬT/TẮT BẢO TRÌ */}
              {activeTab === 'admin-roles' && currentUser.role === 'super_admin' && (
                <RolesManagementView
                  onLogAudit={onLogAudit}
                  maintenanceSettings={maintenanceSettings}
                  onTogglePageMaintenance={onTogglePageMaintenance}
                  onSetAllMaintenance={onSetAllMaintenance}
                />
              )}

              {/* QUẢN TRỊ 6: NHẬT KÝ KIỂM TOÁN (AUDIT LOGS) */}
              {activeTab === 'admin-audit' && currentUser.role === 'super_admin' && <AuditLogsView logs={auditLogs} />}
            </Suspense>
          </div>
        </main>
      </div>

      {/* 3. Global Modals trong Workspace */}
      <SaveToProjectModal
        isOpen={Boolean(queryToSave)}
        onClose={() => setQueryToSave(null)}
        querySql={queryToSave || ''}
        projects={projects}
        onSave={onSaveQueryToProject}
      />

      <SchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        tables={companyEngine.getTables()}
        relationships={companyEngine.getRelationships()}
      />

      {isAuthModalOpen && (
        <AuthModal
          onLogin={(user) => {
            setIsAuthModalOpen(false);
            onAuthSuccess(user);
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      <MaintenanceModal
        isOpen={maintenanceModalState.isOpen}
        onClose={onCloseMaintenance}
        featureName={maintenanceModalState.featureName}
        title={maintenanceModalState.title}
        description={maintenanceModalState.description}
        onSwitchToPlayground={onOpenSql}
      />
    </div>
  );
};
