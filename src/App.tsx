import React, { useState, useRef, useCallback } from 'react';
import {
  UserProfile,
  CourseItem,
  ProjectItem,
  StudentManagementItem,
  AuditLogItem,
  AppNavTab,
} from './types/platform';
import {
  defaultLearner,
  defaultAdmin,
  defaultGuest,
  defaultCourses,
  defaultProjects,
  defaultStudents,
  defaultAuditLogs,
} from './mock/platformData';
import { companyDbTables } from './engine/initialDb';
import { SQLEngine } from './engine/sqlEngine';

// OOP Services - Tầng nghiệp vụ hướng đối tượng
import { AuditService } from './services/AuditService';
import { ProjectService } from './services/ProjectService';
import { StudentService } from './services/StudentService';
import { MaintenanceService } from './services/MaintenanceService';

// Custom Hooks
import { useNavigation } from './hooks/useNavigation';

// Landing Page Component & Modals
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { MaintenanceModal } from './components/common/MaintenanceModal';

// Modules riêng biệt cho từng khu vực
import { SqlPlaygroundModule } from './modules/sql/SqlPlaygroundModule';
import { WorkspaceModule } from './modules/workspace/WorkspaceModule';

/**
 * ============================================================================
 * ROOT COMPONENT: App
 * ============================================================================
 * Quản lý vòng đời và điều phối các module của SQLFlow theo kiến trúc Clean Code & OOP:
 * 1. Tầng OOP Services: Đóng gói toàn bộ logic CSDL, Audit, Dự án, Học viên, Bảo trì.
 * 2. Tầng Custom Hooks: Đồng bộ trạng thái với lịch sử duyệt web (Back / Forward) và bảo vệ route Admin.
 * 3. Tầng Modules: Chia nhỏ giao diện thành Landing Page, SQL Playground và Workspace.
 */
export const App: React.FC = () => {
  // 1. KHỞI TẠO TẦNG OOP SERVICES (Service Layer)
  const companyEngineRef = useRef<SQLEngine>(new SQLEngine(companyDbTables));
  const auditServiceRef = useRef<AuditService>(new AuditService(defaultAuditLogs));
  const projectServiceRef = useRef<ProjectService>(new ProjectService(defaultProjects));
  const studentServiceRef = useRef<StudentService>(new StudentService(defaultStudents));
  const maintenanceServiceRef = useRef<MaintenanceService>(new MaintenanceService());

  // 2. STATE ĐỒNG BỘ HIỂN THỊ VỚI GIAO DIỆN (UI States)
  const [courses, setCourses] = useState<CourseItem[]>(defaultCourses);
  const [projects, setProjects] = useState<ProjectItem[]>(() => projectServiceRef.current.getProjects());
  const [students, setStudents] = useState<StudentManagementItem[]>(() => studentServiceRef.current.getStudents());
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => auditServiceRef.current.getLogs());
  const [maintenanceSettings, setMaintenanceSettings] = useState(() => maintenanceServiceRef.current.getSettings());

  // Trạng thái người dùng và phiên đăng nhập
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultGuest);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isWorkspaceDemo, setIsWorkspaceDemo] = useState<boolean>(false);
  const [isLandingAuthModalOpen, setIsLandingAuthModalOpen] = useState<boolean>(false);

  // Bảo vệ route Quản trị viên: Yêu cầu đăng nhập đúng tài khoản Admin mới được vào
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [pendingAdminTab, setPendingAdminTab] = useState<AppNavTab | null>(null);

  // Modal Bảo Trì dùng chung toàn hệ thống
  const [maintenanceModalState, setMaintenanceModalState] = useState<{
    isOpen: boolean;
    featureName?: string;
    title?: string;
    description?: string;
  }>({ isOpen: false });

  const handleTriggerMaintenance = useCallback((featureName?: string, description?: string, title?: string) => {
    setMaintenanceModalState({ isOpen: true, featureName, title, description });
  }, []);

  const handleCloseMaintenance = useCallback(() => {
    setMaintenanceModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Xác định người dùng có phải là Super Admin đã đăng nhập hay không
  const isAdminAuthenticated = isAuthenticated && currentUser.role === 'super_admin' && !isWorkspaceDemo;

  // Callback ổn định (useCallback) để hook điều hướng không chạy lại liên tục mỗi lần render
  const handleRequireAdminAuth = useCallback((targetAdminTab: AppNavTab) => {
    // Khi người dùng bấm hoặc dán URL admin (như #workspace/admin-roles) mà chưa đăng nhập
    setPendingAdminTab(targetAdminTab);
    setIsAdminAuthModalOpen(true);
  }, []);

  const handleEnterGuestSql = useCallback(() => {
    setIsGuest(true);
    setIsWorkspaceDemo(false);
    setIsAuthenticated(false);
    setCurrentUser(defaultGuest);
  }, []);

  // 3. ĐIỀU HƯỚNG VÀ LỊCH SỬ DUYỆT WEB (Custom Hook có bảo vệ route Admin)
  const {
    currentView,
    activeTab,
    handleOpenLandingPage,
    handleOpenSql: triggerOpenSql,
    handleEnterWorkspace,
    handleSelectTab,
  } = useNavigation({
    maintenanceSettings,
    onTriggerMaintenance: handleTriggerMaintenance,
    isAdminAuthenticated,
    onRequireAdminAuth: handleRequireAdminAuth,
    onEnterGuestSql: handleEnterGuestSql,
  });

  // 4. CÁC HÀM XỬ LÝ NGHIỆP VỤ THÔNG QUA OOP SERVICES
  // Ghi nhật ký kiểm toán (Audit Log)
  const logAudit = useCallback((action: string, target: string, status: 'success' | 'warning' | 'danger' = 'success') => {
    auditServiceRef.current.addLog(action, target, currentUser.name, currentUser.role, status);
    setAuditLogs(auditServiceRef.current.getLogs());
  }, [currentUser.name, currentUser.role]);

  // Quản trị viên: Bật/Tắt bảo trì từng trang
  const handleTogglePageMaintenance = useCallback((pageId: keyof typeof maintenanceSettings, enabled?: boolean) => {
    const updated = maintenanceServiceRef.current.togglePage(pageId, enabled);
    setMaintenanceSettings(updated);
    const meta = maintenanceServiceRef.current.getPagesMeta().find(p => p.id === pageId);
    logAudit(
      updated[pageId] ? 'Kích hoạt Bảo trì Trang' : 'Gỡ bỏ Bảo trì Trang',
      `${meta?.name || pageId} (${meta?.route || ''}) -> ${updated[pageId] ? 'BẢO TRÌ (View-Only)' : 'HOẠT ĐỘNG BÌNH THƯỜNG'}`
    );
  }, [logAudit]);

  // Quản trị viên: Bật/Tắt bảo trì toàn bộ hệ thống
  const handleSetAllMaintenance = useCallback((enable: boolean) => {
    const updated = maintenanceServiceRef.current.setAll(enable);
    setMaintenanceSettings(updated);
    logAudit(
      enable ? 'Kích hoạt Bảo trì Toàn Hệ Thống' : 'Gỡ bỏ Bảo trì Toàn Hệ Thống',
      enable ? 'Tất cả 6 trang rơi vào chế độ bảo trì (View-only)' : 'Tất cả các trang mở hoạt động bình thường'
    );
  }, [logAudit]);

  // Mở SQL Playground độc lập
  const handleOpenSql = useCallback(() => {
    setIsGuest(true);
    setIsWorkspaceDemo(false);
    setIsAuthenticated(false);
    setCurrentUser(defaultGuest);
    triggerOpenSql();
    logAudit('Mở trang SQL IDE riêng biệt', 'Sử dụng môi trường SQL IDE độc lập');
  }, [logAudit, triggerOpenSql]);

  // Mở Không Gian Học Tập ở chế độ Xem Demo (Read-Only)
  const handleEnterWorkspaceDemo = useCallback((targetTab: typeof activeTab = 'overview') => {
    setIsWorkspaceDemo(true);
    setIsGuest(false);
    setIsAuthenticated(false);
    setCurrentUser(defaultLearner);
    handleEnterWorkspace(targetTab);
    logAudit('Xem Demo Không Gian Học', 'Tham quan trước toàn bộ lộ trình và giao diện (Chế độ xem trước)');

    // Nếu Admin đang bật bảo trì "Không gian học" -> hiện pop-up bảo trì ngay khi vào
    if (maintenanceSettings.workspace) {
      setTimeout(() => {
        handleTriggerMaintenance(
          'Không gian học SQL',
          'Không gian học SQL đang được bảo trì nâng cấp hệ thống. Hiện tại bạn chỉ có thể xem trước giao diện (View-Only), các tính năng sẽ sớm hoạt động trở lại!',
          'Hệ Thống Đang Bảo Trì Nâng Cấp'
        );
      }, 250);
    }
  }, [handleEnterWorkspace, handleTriggerMaintenance, logAudit, maintenanceSettings.workspace]);

  // Đăng nhập thành công cho Học viên thông thường
  const handleAuthSuccess = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsGuest(false);
    setIsWorkspaceDemo(false);
    setIsLandingAuthModalOpen(false);
    const initialTab = user.role === 'learner' ? 'overview' : 'admin-dashboard';
    handleEnterWorkspace(initialTab);
    logAudit('Đăng nhập thành công', `Tài khoản: ${user.email} (${user.role})`);
  }, [handleEnterWorkspace, logAudit]);

  // Đăng nhập thành công cho Quản trị viên (Super Admin) khi truy cập các trang quản trị
  const handleAdminAuthSuccess = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsGuest(false);
    setIsWorkspaceDemo(false);
    setIsAdminAuthModalOpen(false);
    const target = pendingAdminTab || 'admin-roles';
    handleEnterWorkspace(target);
    setPendingAdminTab(null);
    logAudit('Đăng nhập Quản trị viên thành công', `Tài khoản: ${user.email} (Super Admin)`);
  }, [handleEnterWorkspace, logAudit, pendingAdminTab]);

  // Đóng Modal đăng nhập Admin mà không đăng nhập -> Hủy và giữ ở trang tổng quan
  const handleCloseAdminAuthModal = useCallback(() => {
    setIsAdminAuthModalOpen(false);
    setPendingAdminTab(null);
    if (window.location.hash.includes('admin-')) {
      window.history.pushState(null, '', '#workspace/overview');
    }
  }, []);

  // Đăng xuất tài khoản
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setIsGuest(false);
    setCurrentUser(defaultGuest);
    handleOpenLandingPage();
    logAudit('Đăng xuất tài khoản', 'Kết thúc phiên làm việc');
  }, [handleOpenLandingPage, logAudit]);

  // Chuyển đổi vai trò linh hoạt: Nếu là học viên muốn chuyển sang admin thì PHẢI đăng nhập tài khoản admin
  const handleToggleRole = useCallback(() => {
    if (currentUser.role === 'learner') {
      setPendingAdminTab('admin-dashboard');
      setIsAdminAuthModalOpen(true);
    } else {
      setCurrentUser(defaultLearner);
      handleEnterWorkspace('overview');
      logAudit('Chuyển vai trò học viên', 'Kích hoạt phiên làm việc Learner');
    }
  }, [currentUser.role, handleEnterWorkspace, logAudit]);

  // Nghiệp vụ Quản lý Dự án cá nhân qua ProjectService
  const handleCreateProject = useCallback((title: string, description: string, engine: 'PostgreSQL' | 'MySQL' | 'SQLite') => {
    projectServiceRef.current.createProject(title, description, engine);
    setProjects(projectServiceRef.current.getProjects());
    logAudit('Tạo dự án mới', `Dự án: ${title} (${engine})`);
  }, [logAudit]);

  const handleUpdateProject = useCallback((id: string, updates: Partial<ProjectItem>) => {
    projectServiceRef.current.updateProject(id, updates);
    setProjects(projectServiceRef.current.getProjects());
    logAudit('Cập nhật dự án', `ID: ${id}`);
  }, [logAudit]);

  const handleDeleteProject = useCallback((id: string) => {
    const target = projectServiceRef.current.findById(id);
    projectServiceRef.current.deleteProject(id);
    setProjects(projectServiceRef.current.getProjects());
    logAudit('Xóa dự án', `Dự án: ${target?.title || id}`, 'danger');
  }, [logAudit]);

  const handleDuplicateProject = useCallback((id: string) => {
    const duplicated = projectServiceRef.current.duplicateProject(id);
    if (duplicated) {
      setProjects(projectServiceRef.current.getProjects());
      logAudit('Nhân bản dự án', `Bản sao: ${duplicated.title}`);
    }
  }, [logAudit]);

  const handleSaveQueryToProject = useCallback((projectId: string, queryTitle: string, sql: string) => {
    projectServiceRef.current.addQueryToProject(projectId, queryTitle, sql);
    setProjects(projectServiceRef.current.getProjects());
    logAudit('Lưu truy vấn vào dự án', `Dự án ID: ${projectId}, Query: ${queryTitle}`);
  }, [logAudit]);

  const handleDeleteQueryFromProject = useCallback((projectId: string, queryId: string) => {
    projectServiceRef.current.deleteQueryFromProject(projectId, queryId);
    setProjects(projectServiceRef.current.getProjects());
    logAudit('Xóa truy vấn khỏi dự án', `Query ID: ${queryId}`);
  }, [logAudit]);

  const handleUpdateQueryInProject = useCallback((projectId: string, queryId: string, updates: Partial<ProjectItem['queries'][0]>) => {
    projectServiceRef.current.updateQueryInProject(projectId, queryId, updates);
    setProjects(projectServiceRef.current.getProjects());
    logAudit('Cập nhật file truy vấn', `Query ID: ${queryId}`);
  }, [logAudit]);

  // Nghiệp vụ Quản lý Học viên qua StudentService
  const handleToggleBlockStudent = useCallback((studentId: string) => {
    const { student, nextStatus } = studentServiceRef.current.toggleBlock(studentId);
    if (student) {
      setStudents(studentServiceRef.current.getStudents());
      logAudit(
        nextStatus === 'blocked' ? 'Khóa tài khoản học viên' : 'Mở khóa tài khoản học viên',
        `Học viên: ${student.name} (${student.email})`,
        nextStatus === 'blocked' ? 'danger' : 'warning'
      );
    }
  }, [logAudit]);

  const handleResetPasswordStudent = useCallback((studentId: string) => {
    const student = studentServiceRef.current.findById(studentId);
    if (student) {
      logAudit('Yêu cầu đặt lại mật khẩu', `Gửi email khôi phục tới: ${student.email}`);
    }
  }, [logAudit]);

  const handleAddSupportNote = useCallback((studentId: string, noteContent: string) => {
    const updated = studentServiceRef.current.addSupportNote(studentId, currentUser.name, noteContent);
    if (updated) {
      setStudents(studentServiceRef.current.getStudents());
      logAudit('Thêm ghi chú hỗ trợ học viên', `Ghi chú cho học viên ID: ${studentId}`);
    }
  }, [currentUser.name, logAudit]);

  // Hoàn thành bài tập
  const handleCompleteExercise = useCallback(() => {
    setCurrentUser(prev => ({
      ...prev,
      completedLessons: Math.min(prev.totalLessons, prev.completedLessons + 1),
      skillPoints: prev.skillPoints + 50,
    }));
    logAudit('Hoàn thành bài tập SQL', `${currentUser.currentLessonTitle} (+50 điểm)`);
  }, [currentUser.currentLessonTitle, logAudit]);

  // 5. RENDER THEO MODULE CHÍNH

  // MODULE 1: LANDING PAGE (Trang chủ giới thiệu)
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          isAuthenticated={isAuthenticated}
          onOpenSqlIde={handleOpenSql}
          onStartGuestPractice={handleOpenSql}
          onOpenLogin={() => handleEnterWorkspaceDemo('overview')}
          onOpenLearnPending={() => handleEnterWorkspaceDemo('overview')}
          onEnterWorkspace={() => handleEnterWorkspaceDemo('overview')}
          onTriggerMaintenance={handleTriggerMaintenance}
          isCurriculumMaintenance={maintenanceSettings.curriculum}
        />
        {isLandingAuthModalOpen && (
          <AuthModal
            onLogin={handleAuthSuccess}
            onClose={() => setIsLandingAuthModalOpen(false)}
          />
        )}
        {isAdminAuthModalOpen && (
          <AuthModal
            requiredRole="super_admin"
            onLogin={handleAdminAuthSuccess}
            onClose={handleCloseAdminAuthModal}
            customTitle="Xác Thực Quản Trị Viên"
            customDescription="Đường dẫn này chỉ dành riêng cho Quản trị viên (Super Admin). Vui lòng đăng nhập đúng tài khoản Quản trị viên để truy cập."
          />
        )}
        <MaintenanceModal
          isOpen={maintenanceModalState.isOpen}
          onClose={handleCloseMaintenance}
          featureName={maintenanceModalState.featureName}
          title={maintenanceModalState.title}
          description={maintenanceModalState.description}
          onSwitchToPlayground={handleOpenSql}
        />
      </>
    );
  }

  // MODULE 2: SQL PLAYGROUND (Trình soạn thảo SQL độc lập với DB CTY 4 bảng Tiếng Việt)
  if (currentView === 'sql') {
    return (
      <>
        <SqlPlaygroundModule
          companyEngine={companyEngineRef.current}
          onBackToLanding={handleOpenLandingPage}
          onOpenWorkspaceDemo={() => handleEnterWorkspaceDemo('overview')}
          onAuthSuccess={handleAuthSuccess}
          onCompleteExercise={handleCompleteExercise}
        />
        {isAdminAuthModalOpen && (
          <AuthModal
            requiredRole="super_admin"
            onLogin={handleAdminAuthSuccess}
            onClose={handleCloseAdminAuthModal}
            customTitle="Xác Thực Quản Trị Viên"
            customDescription="Đường dẫn này chỉ dành riêng cho Quản trị viên (Super Admin). Vui lòng đăng nhập đúng tài khoản Quản trị viên để truy cập."
          />
        )}
      </>
    );
  }

  // MODULE 3: WORKSPACE (Không gian học tập & Quản trị hệ thống)
  return (
    <>
      <WorkspaceModule
        activeTab={activeTab}
        onSelectTab={(tab) => handleSelectTab(tab, isGuest, () => setIsLandingAuthModalOpen(true))}
        currentUser={currentUser}
        onToggleRole={handleToggleRole}
        onLogout={handleLogout}
        isGuest={isGuest}
        isWorkspaceDemo={isWorkspaceDemo}
        onOpenLandingPage={handleOpenLandingPage}
        onOpenSql={handleOpenSql}
        onOpenLogin={() => setIsLandingAuthModalOpen(true)}
        onAuthSuccess={handleAuthSuccess}
        courses={courses}
        projects={projects}
        students={students}
        auditLogs={auditLogs}
        companyEngine={companyEngineRef.current}
        maintenanceSettings={maintenanceSettings}
        onTogglePageMaintenance={handleTogglePageMaintenance}
        onSetAllMaintenance={handleSetAllMaintenance}
        onTriggerMaintenance={handleTriggerMaintenance}
        maintenanceModalState={maintenanceModalState}
        onCloseMaintenance={handleCloseMaintenance}
        onCreateProject={handleCreateProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
        onSaveQueryToProject={handleSaveQueryToProject}
        onDeleteQueryFromProject={handleDeleteQueryFromProject}
        onUpdateQueryInProject={handleUpdateQueryInProject}
        onToggleBlockStudent={handleToggleBlockStudent}
        onResetPasswordStudent={handleResetPasswordStudent}
        onAddSupportNote={handleAddSupportNote}
        onUpdateProfile={(updated) => {
          setCurrentUser(prev => ({ ...prev, ...updated }));
          logAudit('Cập nhật hồ sơ cá nhân', currentUser.email);
        }}
        onAddCourse={(course) => {
          setCourses(prev => [course, ...prev]);
          logAudit('Thêm khóa học mới', course.title);
        }}
        onCompleteExercise={handleCompleteExercise}
        onLogAudit={logAudit}
      />
      {isAdminAuthModalOpen && (
        <AuthModal
          requiredRole="super_admin"
          onLogin={handleAdminAuthSuccess}
          onClose={handleCloseAdminAuthModal}
          customTitle="Xác Thực Quản Trị Viên"
          customDescription="Đường dẫn này chỉ dành riêng cho Quản trị viên (Super Admin). Vui lòng đăng nhập đúng tài khoản Quản trị viên để truy cập."
        />
      )}
    </>
  );
};

export default App;
