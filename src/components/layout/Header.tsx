import React, { useState, useRef, useEffect } from 'react';
import { AppNavTab, UserProfile } from '../../types/platform';
import { 
  Bell,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  LogIn
} from 'lucide-react';

interface HeaderProps {
  activeTab: AppNavTab;
  currentUser: UserProfile;
  onToggleRole?: () => void;
  onOpenProfile: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  isGuest?: boolean;
  isWorkspaceDemo?: boolean;
  canToggleRole?: boolean;
  onOpenLandingPage?: () => void;
  onOpenLogin?: () => void;
}

export const HeaderComponent: React.FC<HeaderProps> = ({
  activeTab,
  currentUser,
  onToggleRole,
  onOpenProfile,
  isSidebarCollapsed,
  onToggleSidebar,
  isGuest = false,
  isWorkspaceDemo = false,
  canToggleRole = false,
  onOpenLandingPage,
  onOpenLogin,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const tabTitles: Record<AppNavTab, { category: string; title: string }> = {
    'overview': { category: 'SQLFlow', title: 'Tổng quan' },
    'practice': { category: 'SQLFlow', title: 'Luyện tập SQL' },
    'courses': { category: 'SQLFlow', title: 'Khóa học' },
    'projects': { category: 'SQLFlow', title: 'Dự án của tôi' },
    'profile': { category: 'SQLFlow', title: 'Hồ sơ cá nhân' },
    'admin-dashboard': { category: 'Quản trị hệ thống', title: 'Dashboard Tổng quan' },
    'admin-students': { category: 'Quản trị hệ thống', title: 'Quản lý Học viên' },
    'admin-courses': { category: 'Quản trị hệ thống', title: 'Quản lý Khóa học' },
    'admin-exercises': { category: 'Quản trị hệ thống', title: 'Quản lý Bài tập SQL' },
    'admin-roles': { category: 'Quản trị hệ thống', title: 'Vai trò & Phân quyền' },
    'admin-audit': { category: 'Quản trị hệ thống', title: 'Nhật ký Hệ thống' },
  };

  const breadcrumb = tabTitles[activeTab] || { category: 'SQLFlow', title: 'Khám phá' };
  const isLearner = currentUser.role === 'learner';

  const mockNotifications = [
    { id: 1, title: 'Chuỗi học tập', desc: 'Bạn đã đạt mốc 12 ngày liên tục! Giữ vững phong độ nhé.', time: '10 phút trước', unread: true },
    { id: 2, title: 'Bài tập mới', desc: 'Khóa học Advanced SQL vừa mở thêm bài tập Window Functions.', time: '2 giờ trước', unread: true },
    { id: 3, title: 'Góp ý Mentor', desc: 'Mentor Tuấn đã gửi nhận xét bài tập GROUP BY & HAVING của bạn.', time: '1 ngày trước', unread: false },
  ];

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between border-b border-slate-100 select-none flex-shrink-0 sticky top-0 z-20">
      {/* Apple SF Breadcrumb Area */}
      <div className="flex items-center space-x-3.5">
        <div>
          <p className="text-[11px] text-slate-500 font-medium tracking-tight">
            {breadcrumb.category}
          </p>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {breadcrumb.title}
          </h2>
        </div>
      </div>

      {/* Right Controls: Landing Page link, Role / Guest status, Notifications, Profile */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5">
        
        {/* Landing Page Button */}
        {onOpenLandingPage && (
          <button
            onClick={onOpenLandingPage}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-[#0284C7] bg-slate-100/80 hover:bg-blue-50 border border-slate-200/80 transition active:scale-95 shadow-2xs"
            title="Quay lại trang giới thiệu sản phẩm"
          >
            <Home className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="hidden md:inline">Trang giới thiệu</span>
          </button>
        )}

        {/* Guest Mode Badge & Login CTA OR Role Switcher */}
        {isGuest ? (
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 hidden sm:inline-flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Chế độ Khách (Chưa đăng nhập)</span>
            </span>

            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:shadow-md hover:shadow-[#0284C7]/20 transition active:scale-95 cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        ) : isWorkspaceDemo ? (
          /* Demo / View-Only Badge */
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 inline-flex items-center space-x-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Chế độ Xem Trước (View-Only)</span>
            </span>
          </div>
        ) : (
          /* Role badge for authenticated users */
          canToggleRole && currentUser.role === 'super_admin' && onToggleRole ? (
            <button
              onClick={onToggleRole}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-[0.98] shadow-sm bg-purple-50/90 hover:bg-purple-100/90 text-purple-700 border border-purple-200/80 cursor-pointer"
              title="Nhấn để đổi vai trò Học viên / Super Admin"
            >
              <span className="w-2 h-2 rounded-full bg-[#AF52DE] animate-pulse" />
              <span className="font-semibold text-slate-800">Super Admin</span>
              <span className="text-[10px] text-purple-600 font-medium pl-1 border-l border-purple-200">
                Đổi sang Học viên
              </span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50/90 text-blue-700 border border-blue-200/80">
              <span className="w-2 h-2 rounded-full bg-[#0071E3] animate-pulse" />
              <span className="font-semibold text-slate-800">
                {currentUser.role === 'super_admin' ? 'Super Admin' : 'Học viên'}
              </span>
            </div>
          )
        )}

        {/* Notification Bell (Apple Glass Circle) */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-sm active:scale-95 relative"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF3B30] ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown (macOS Notification Center Style) */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-84 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-900">Thông báo gần đây</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {mockNotifications.map((n) => (
                  <div key={n.id} className={`p-3 rounded-2xl border text-xs transition ${
                    n.unread ? 'bg-blue-50/80 border-blue-200/80' : 'bg-slate-50/80 border-slate-100'
                  }`}>
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill (Apple ID Style) */}
        <button
          onClick={onOpenProfile}
          className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-full bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/80 shadow-sm transition-all active:scale-95 group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0071E3] to-[#5E5CE6] text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {currentUser.avatarText}
          </div>
          <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[100px] truncate">
            {currentUser.name.split(' ').slice(-1)[0]}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
      </div>
    </header>
  );
};

export const Header = React.memo(HeaderComponent);
