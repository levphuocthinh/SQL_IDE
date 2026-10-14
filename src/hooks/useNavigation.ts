import { useState, useEffect, useCallback } from 'react';
import { AppNavTab } from '../types/platform';
import { MaintenanceSettings } from '../config/maintenance';

interface UseNavigationOptions {
  maintenanceSettings: MaintenanceSettings;
  onTriggerMaintenance: (featureName?: string, description?: string, title?: string) => void;
  onEnterGuestSql?: () => void;
  isAdminAuthenticated: boolean;
  onRequireAdminAuth: (targetAdminTab: AppNavTab) => void;
}

export interface UseNavigationReturn {
  currentView: 'landing' | 'sql' | 'workspace';
  setCurrentView: React.Dispatch<React.SetStateAction<'landing' | 'sql' | 'workspace'>>;
  activeTab: AppNavTab;
  setActiveTab: React.Dispatch<React.SetStateAction<AppNavTab>>;
  handleOpenLandingPage: () => void;
  handleOpenSql: () => void;
  handleEnterWorkspace: (targetTab?: AppNavTab) => void;
  handleSelectTab: (tab: AppNavTab, isGuest?: boolean, onRequireAuth?: () => void) => void;
}

const VALID_WORKSPACE_TABS: AppNavTab[] = [
  'overview',
  'practice',
  'courses',
  'projects',
  'profile',
  'admin-dashboard',
  'admin-students',
  'admin-courses',
  'admin-exercises',
  'admin-roles',
  'admin-audit',
];

/**
 * ============================================================================
 * HOOK: useNavigation
 * ============================================================================
 * Quản lý đồng bộ 2 chiều giữa URL Hash, Browser History (Back / Forward),
 * State điều hướng và kiểm soát phân quyền truy cập khu vực Quản trị Admin.
 */
export const useNavigation = ({
  maintenanceSettings,
  onTriggerMaintenance,
  onEnterGuestSql,
  isAdminAuthenticated,
  onRequireAdminAuth,
}: UseNavigationOptions): UseNavigationReturn => {
  const [currentView, setCurrentView] = useState<'landing' | 'sql' | 'workspace'>('landing');
  const [activeTab, setActiveTab] = useState<AppNavTab>('overview');

  // Điều hướng về Landing Page và cập nhật lịch sử trình duyệt
  const handleOpenLandingPage = useCallback(() => {
    setCurrentView('landing');
    if (window.location.hash !== '' && window.location.hash !== '#landing' && window.location.hash !== '#') {
      window.history.pushState(null, '', '#landing');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Mở màn hình SQL Playground
  const handleOpenSql = useCallback(() => {
    setCurrentView('sql');
    if (window.location.hash !== '#sql') {
      window.history.pushState(null, '', '#sql');
    }
    if (onEnterGuestSql) {
      onEnterGuestSql();
    }
  }, [onEnterGuestSql]);

  // Điều hướng vào Không Gian Học Tập (Workspace)
  const handleEnterWorkspace = useCallback((targetTab: AppNavTab = 'overview') => {
    setCurrentView('workspace');
    setActiveTab(targetTab);
    const targetHash = `#workspace/${targetTab}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
  }, []);

  // Chọn tab trong Workspace và đồng bộ vào Browser History (có bảo vệ Admin tab)
  const handleSelectTab = useCallback(
    (tab: AppNavTab, isGuest: boolean = false, onRequireAuth?: () => void) => {
      // 1. Chặn khách vãng lai truy cập tính năng cá nhân
      if (isGuest && (tab === 'projects' || tab === 'profile' || tab.startsWith('admin-'))) {
        if (onRequireAuth) {
          onRequireAuth();
        }
        return;
      }

      // 2. Chặn truy cập trái phép vào các tab Quản trị viên
      if (tab.startsWith('admin-') && !isAdminAuthenticated) {
        if (onRequireAdminAuth) {
          onRequireAdminAuth(tab);
        }
        return;
      }

      setActiveTab(tab);
      const targetHash = `#workspace/${tab}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    },
    [isAdminAuthenticated, onRequireAdminAuth]
  );

  // Lắng nghe sự kiện người dùng bấm nút Back (<-) hoặc Forward (->) hoặc nhập trực tiếp URL
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash || '';

      // Kịch bản 1: URL là #sql -> Mở SQL Playground độc lập
      if (hash === '#sql' || hash.startsWith('#sql?')) {
        setCurrentView('sql');
        if (onEnterGuestSql) {
          onEnterGuestSql();
        }
        if (maintenanceSettings.sqlPlayground) {
          setTimeout(() => {
            onTriggerMaintenance(
              'SQL Playground (Tự do)',
              'Trang SQL Playground đang được bảo trì nâng cấp hệ thống. Bạn vui lòng quay lại sau ít phút!',
              'Tính Năng Đang Bảo Trì'
            );
          }, 200);
        }
        return;
      }

      // Kịch bản 2: URL là #workspace/... -> Mở Không gian học tập với tab tương ứng
      if (hash.startsWith('#workspace')) {
        setCurrentView('workspace');
        const tabPart = hash.replace(/^#workspace\/?/, '').split('?')[0] as AppNavTab;

        if (VALID_WORKSPACE_TABS.includes(tabPart)) {
          // BẢO VỆ ĐẶC BIỆT CHO LIÊN KẾT ADMIN:
          // Ví dụ: http://localhost:3000/#workspace/admin-roles
          // Nếu người dùng chưa đăng nhập đúng tài khoản Admin -> CHẶN NGAY và bật Modal đăng nhập Admin
          if (tabPart.startsWith('admin-')) {
            if (!isAdminAuthenticated) {
              setActiveTab('overview');
              onRequireAdminAuth(tabPart);
              return;
            }
          }

          setActiveTab(tabPart);
        }
        return;
      }

      // Kịch bản 3: Mặc định là Landing Page (#, #landing, #curriculum, #two-modes, #features, #playground-demo)
      setCurrentView('landing');

      const anchorId = hash.replace(/^#/, '').split('?')[0];
      if (anchorId && anchorId !== 'landing') {
        setTimeout(() => {
          const el = document.getElementById(anchorId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);

        // Khi vào #curriculum VÀ Admin đang bật bảo trì -> Tự động bật Popup bảo trì
        if (anchorId === 'curriculum' && maintenanceSettings.curriculum) {
          setTimeout(() => {
            onTriggerMaintenance(
              'Lộ trình học tập SQL',
              'Lộ trình học tập hiện tại chỉ hỗ trợ xem nội dung (Chỉ được view thôi nè). Toàn bộ hệ thống làm bài tương tác, nộp bài tập và chấm điểm đang được bảo trì nâng cấp hệ thống và sẽ sớm có sau trong bản cập nhật tới!',
              'Hệ Thống Đang Bảo Trì - Chỉ Xem Trước (View-Only)'
            );
          }, 200);
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    // Kích hoạt ngay khi mở web hoặc reload F5
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [
    isAdminAuthenticated,
    maintenanceSettings.curriculum,
    maintenanceSettings.sqlPlayground,
    onEnterGuestSql,
    onRequireAdminAuth,
    onTriggerMaintenance,
  ]);

  return {
    currentView,
    setCurrentView,
    activeTab,
    setActiveTab,
    handleOpenLandingPage,
    handleOpenSql,
    handleEnterWorkspace,
    handleSelectTab,
  };
};
