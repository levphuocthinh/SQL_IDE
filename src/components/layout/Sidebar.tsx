import React, { useState, useRef, useEffect } from 'react';
import { AppNavTab, UserProfile } from '../../types/platform';
import { 
  Compass,
  Code2,
  BookOpen,
  FolderGit2,
  User,
  ShieldCheck,
  Users,
  GraduationCap,
  KeyRound,
  ScrollText,
  ArrowLeftRight,
  LogOut,
  Database,
  Home
} from 'lucide-react';

interface SidebarProps {
  activeTab: AppNavTab;
  onSelectTab: (tab: AppNavTab) => void;
  currentUser: UserProfile;
  onToggleRole?: () => void;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenLandingPage?: () => void;
  isWorkspaceDemo?: boolean;
  canToggleRole?: boolean;
}

export const SidebarComponent: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onToggleRole,
  onLogout,
  onOpenLandingPage,
  isWorkspaceDemo = false,
  canToggleRole = false,
}) => {
  // Chỉ hiển thị giao diện Admin nếu thực sự là Super Admin và không ở trong chế độ Xem Demo bảo trì
  const isSuperAdmin = currentUser.role === 'super_admin' && !isWorkspaceDemo;
  const isLearner = !isSuperAdmin;
  const showRoleSwitcher = Boolean(canToggleRole && isSuperAdmin && !isWorkspaceDemo && onToggleRole);

  // Hover state: expands to full width on mouse hover, returns to mini/slim bar on mouse leave
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    // 120ms gentle buffer for smooth natural feel
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // Navigation items for Learner
  const learnerNavItems = [
    { id: 'overview' as AppNavTab, label: 'Tổng quan', icon: Compass },
    { id: 'practice' as AppNavTab, label: 'Luyện tập SQL', icon: Code2 },
    { id: 'courses' as AppNavTab, label: 'Khóa học', icon: BookOpen },
    { id: 'projects' as AppNavTab, label: 'Dự án của tôi', icon: FolderGit2 },
    { id: 'profile' as AppNavTab, label: 'Hồ sơ', icon: User },
  ];

  // Navigation items for Admin
  const adminNavItems = [
    { id: 'admin-dashboard' as AppNavTab, label: 'Tổng quan Admin', icon: ShieldCheck },
    { id: 'admin-students' as AppNavTab, label: 'Quản lý học viên', icon: Users },
    { id: 'admin-courses' as AppNavTab, label: 'Quản lý khóa học', icon: GraduationCap },
    { id: 'admin-exercises' as AppNavTab, label: 'Quản lý bài tập SQL', icon: Code2 },
    { id: 'admin-roles' as AppNavTab, label: 'Vai trò & Quyền', icon: KeyRound },
    { id: 'admin-audit' as AppNavTab, label: 'Nhật ký hệ thống', icon: ScrollText },
  ];

  const navItems = isLearner ? learnerNavItems : adminNavItems;

  return (
    /* Outer spacer preserves constant 70px width in layout, preventing any page reflow or lag */
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative shrink-0 h-screen z-30 w-[70px]"
    >
      <aside 
        className={`h-screen select-none flex flex-col justify-between bg-gradient-to-b from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] text-white border-r border-cyan-400/20 transition-[width,box-shadow] duration-200 ease-in-out will-change-[width] transform-gpu ${
          isHovered 
            ? 'w-64 absolute left-0 top-0 bottom-0 z-40 shadow-[0_20px_50px_rgba(2,132,199,0.35)]' 
            : 'w-[70px] relative shadow-xs'
        }`}
      >
        {/* 1. TOP BRAND HEADER - Exact h-16 (64px) matching Header navbar */}
        <div className={`h-16 flex items-center border-b border-white/15 shrink-0 w-full ${isHovered ? 'px-4' : 'justify-center px-0'}`}>
          {!isHovered ? (
            /* Collapsed Header: Centered Database Brand Icon */
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-xs">
              <Database className="w-5 h-5 text-white" />
            </div>
          ) : (
            /* Expanded Header: Brand SQLFlow on Left */
            <div 
              onClick={() => onSelectTab(isLearner ? 'overview' : 'admin-dashboard')}
              className="flex items-center space-x-2.5 cursor-pointer truncate w-full"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-xs flex-shrink-0">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div className="truncate">
                <h1 className="text-white font-extrabold text-sm tracking-tight leading-tight">
                  SQLFlow
                </h1>
                <p className="text-[10px] text-white/80 font-medium tracking-wide">
                  Designed for Mastery
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2. NAVIGATION DOCK */}
        <div className={`w-full flex-1 flex flex-col ${!isHovered ? 'overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
          {!isHovered ? (
            /* COLLAPSED / SLIM MODE: Icons always visible, active item has organic scoop curve notch */
            <div className="flex flex-col w-full space-y-2 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                if (isActive) {
                  return (
                    <div key={item.id} className="relative w-full h-12 flex items-center justify-end">
                      {/* Notch curving out smoothly to the right border with ZERO blue gap, overlapping the 1px border seamlessly */}
                      <div 
                        style={{ right: '-1.5px' }}
                        className="absolute top-0 bottom-0 w-[56px] bg-white rounded-l-2xl z-20 flex items-center justify-center shadow-xs"
                      >
                        {/* Top Inverted Scoop Curve */}
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute -top-4 right-0 w-4 h-4 pointer-events-none"
                        >
                          <path d="M16 0V16H0C8.83656 16 16 8.83656 16 0Z" fill="#FFFFFF" />
                        </svg>

                        {/* Bottom Inverted Scoop Curve */}
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute -bottom-4 right-0 w-4 h-4 pointer-events-none"
                        >
                          <path d="M16 16V0H0C8.83656 0 16 7.16344 16 16Z" fill="#FFFFFF" />
                        </svg>

                        {/* Active Icon Circle: matching reference media_1791403014397.png with vibrant cyan-blue badge & crisp white icon */}
                        <button
                          onClick={() => onSelectTab(item.id)}
                          title={item.label}
                          className="relative z-30 w-10 h-10 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white shadow-[0_4px_12px_rgba(2,132,199,0.35)] flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                        >
                          <Icon className="w-5 h-5 text-white stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.id} className="flex items-center justify-center w-full h-11">
                    <button
                      onClick={() => onSelectTab(item.id)}
                      title={item.label}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white/85 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-95"
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* EXPANDED MENU MODE: Full width menu with text labels, no outside floating tab */
            <div className="space-y-1.5 w-full pl-3.5 pr-3 py-4">
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/70">
                {isLearner ? 'KHÔNG GIAN HỌC TẬP' : 'KHU VỰC QUẢN TRỊ'}
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                if (isActive) {
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => onSelectTab(item.id)}
                      className="relative flex items-center space-x-3 px-3.5 py-2.5 w-full bg-white text-[#0284C7] font-bold rounded-2xl z-20 cursor-pointer text-xs select-none shadow-sm transition-all"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0 text-[#0284C7] stroke-[2.5]" />
                      <span className="truncate">{item.label}</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className="group relative flex items-center rounded-xl transition-all font-medium text-xs w-full space-x-3 px-3.5 py-2.5 text-white/85 hover:text-white hover:bg-white/15 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 text-white/80 group-hover:text-white transition-transform" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. BOTTOM: ROLE TOGGLE, USER PROFILE & LOGOUT */}
        <div className={`w-full p-3 border-t border-white/15 shrink-0 ${!isHovered ? 'flex flex-col items-center space-y-2.5' : 'space-y-2.5'}`}>
          {!isHovered ? (
            /* Collapsed Bottom Controls */
            <>
              {onOpenLandingPage && (
                <button
                  onClick={onOpenLandingPage}
                  title="Trang chủ / Giới thiệu"
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition active:scale-95 shadow-xs"
                >
                  <Home className="w-4 h-4 text-white" />
                </button>
              )}

              {showRoleSwitcher && onToggleRole && (
                <button
                  onClick={onToggleRole}
                  title="Đổi vai trò hệ thống"
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition active:scale-95 shadow-xs"
                >
                  <ArrowLeftRight className="w-4 h-4 text-white" />
                </button>
              )}

              <button
                onClick={() => onSelectTab(isLearner ? 'profile' : 'admin-dashboard')}
                title={`Hồ sơ: ${currentUser.name}`}
                className="w-10 h-10 rounded-xl p-0.5 bg-white/25 hover:bg-white/35 shadow-xs transition active:scale-95 relative flex items-center justify-center border border-white/40"
              >
                <div className="w-full h-full rounded-[10px] bg-white text-[#0284C7] flex items-center justify-center text-xs font-extrabold tracking-wider">
                  {currentUser.avatarText || 'TL'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#34C759] border-2 border-[#0284C7]" title="Online" />
              </button>

              <button
                onClick={onLogout}
                title="Đăng xuất"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition active:scale-95"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Expanded Bottom Controls */
            <>
              {/* Landing Page Button */}
              {onOpenLandingPage && (
                <button
                  onClick={onOpenLandingPage}
                  className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-white transition border border-white/25 active:scale-[0.98] cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-white" />
                  <span>Trang giới thiệu sản phẩm</span>
                </button>
              )}

              {/* Role Switcher - Chỉ hiển thị khi có quyền quản trị viên cấp cao */}
              {showRoleSwitcher && onToggleRole && (
                <div className="bg-white/15 border border-white/25 rounded-2xl p-2.5 text-white backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[11px] text-white/80 mb-1.5 px-1">
                    <span>Vai trò hiện tại:</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 text-white border border-white/35">
                      Super Admin
                    </span>
                  </div>

                  <button
                    onClick={onToggleRole}
                    className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded-xl text-xs font-semibold bg-white hover:bg-white/95 text-[#0284C7] transition shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Chuyển sang Học viên</span>
                  </button>
                </div>
              )}

              {/* User Profile & Logout */}
              <div className="flex items-center justify-between px-2.5 py-2 bg-white/15 border border-white/25 rounded-2xl text-white backdrop-blur-sm">
                <div 
                  onClick={() => onSelectTab('profile')}
                  className="flex items-center space-x-2.5 overflow-hidden cursor-pointer flex-1 mr-2"
                >
                  <div className="w-8 h-8 rounded-full bg-white text-[#0284C7] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm border border-white/40">
                    {currentUser.avatarText}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-white/80 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Đăng xuất"
                  className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

export const Sidebar = React.memo(SidebarComponent);
