import React, { useState, useEffect } from 'react';
import { DatabaseDataCube } from './DatabaseDataCube';
import { LiveQueryShowcase } from './LiveQueryShowcase';
import { 
  Database, 
  Play, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Zap, 
  Layers, 
  Code2, 
  GraduationCap, 
  FolderGit2, 
  ShieldCheck, 
  Flame, 
  Users, 
  ChevronRight,
  ChevronUp,
  Eye,
  Star,
  BookOpen,
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface LandingPageProps {
  isAuthenticated: boolean;
  onOpenSqlIde: () => void;
  onOpenLogin: () => void;
  onEnterWorkspace: () => void;
  onStartGuestPractice?: () => void;
  onOpenLearnPending?: () => void;
  onTriggerMaintenance?: (featureName?: string, description?: string, title?: string) => void;
  isCurriculumMaintenance?: boolean;
}

/**
 * Trang đích giới thiệu nền tảng SQLFlow 2.0 (Landing Page)
 * Tích hợp Bento Grid, Mô hình CSDL 3D Isometric (Cục data),
 * và Khung thực hành SQL Sandbox tương tác cao
 */
export const LandingPage: React.FC<LandingPageProps> = ({
  isAuthenticated,
  onOpenSqlIde,
  onOpenLogin,
  onEnterWorkspace,
  onStartGuestPractice,
  onOpenLearnPending,
  onTriggerMaintenance,
  isCurriculumMaintenance = true,
}) => {
  const handleOpenSql = onOpenSqlIde || onStartGuestPractice || (() => {});
  const handleOpenLearn = onOpenLearnPending || onOpenLogin;
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [mobileShowcaseTab, setMobileShowcaseTab] = useState<'sandbox' | 'cube'>('sandbox');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0071E3]/20 selection:text-[#0071E3] overflow-x-hidden scroll-smooth relative">
      
      {/* ======================================================== */}
      {/* 1. TOP GLOBAL NAVIGATION BAR (Apple Glass Style) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 transition-all duration-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-[#0284C7]/25 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-[#0284C7] to-[#0EA5E9] bg-clip-text text-transparent">
                  SQLFlow
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0284C7]/10 text-[#0284C7] border border-[#0284C7]/20 uppercase">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Học & Thực Hành SQL Trực Quan</p>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#two-modes" className="hover:text-[#0071E3] transition">2 Chế độ sử dụng</a>
            <a href="#features" className="hover:text-[#0071E3] transition">Tính năng đột phá</a>
            <a 
              href="#curriculum" 
              onClick={() => {
                if (isCurriculumMaintenance) {
                  onTriggerMaintenance?.(
                    'Lộ trình học tập SQL',
                    'Lộ trình học tập hiện tại chỉ hỗ trợ xem nội dung (Chỉ được view thôi nè). Toàn bộ hệ thống làm bài tương tác, nộp bài tập và chấm điểm đang được bảo trì nâng cấp hệ thống và sẽ sớm có sau trong bản cập nhật tới!',
                    'Hệ Thống Đang Bảo Trì - Chỉ Xem Trước (View-Only)'
                  );
                }
              }}
              className="hover:text-[#0071E3] transition flex items-center space-x-1.5"
            >
              <span>Lộ trình học tập</span>
              {isCurriculumMaintenance && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-300">
                  View-only
                </span>
              )}
            </a>
            <a href="#playground-demo" className="hover:text-[#0071E3] transition">Dùng thử nhanh</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <button
                onClick={onEnterWorkspace}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white text-xs font-semibold hover:shadow-lg hover:shadow-[#0284C7]/25 transition-all active:scale-[0.98] flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Vào Không Gian Học Tập</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                {/* 1. Fast Guest Practice CTA: SQL */}
                <button
                  onClick={handleOpenSql}
                  className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:border-[#0284C7] hover:text-[#0284C7] text-xs font-bold transition active:scale-[0.98] hidden sm:inline-flex items-center space-x-1.5 bg-slate-50/80 cursor-pointer shadow-2xs hover:shadow-sm"
                  title="Vào thực hành SQL ngay lập tức mà không cần tạo tài khoản"
                >
                  <Play className="w-3 h-3 text-[#0284C7] fill-[#0284C7]" />
                  <span>SQL</span>
                </button>

                {/* 2. Full Learner Login CTA: Học SQL (Chế độ Xem Demo) */}
                <button
                  onClick={handleOpenLearn}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white text-xs font-bold hover:shadow-md hover:shadow-[#0284C7]/25 transition active:scale-[0.98] flex items-center space-x-1.5 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-white/95" />
                  <span>Học SQL</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                    Xem Demo
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION WITH DUAL CTAS & AMBIENT GLOW */}
      {/* ======================================================== */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white">
        {/* Subtle Ambient Orbs with Pulsing Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-[#38BDF8]/20 via-[#818CF8]/15 to-[#38BDF8]/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

        {/* Floating Animated SQL Chips */}
        <div className="hidden lg:flex items-center space-x-1.5 absolute top-28 left-6 xl:left-20 px-3.5 py-1.5 rounded-2xl bg-white/90 border border-blue-200/80 shadow-md text-xs font-mono text-[#0284C7] font-semibold animate-float-slow pointer-events-none select-none backdrop-blur-sm z-10">
          <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-ping inline-block mr-1" />
          <span className="text-purple-600 font-bold">SELECT</span> * <span className="text-purple-600 font-bold">FROM</span> NHANVIEN
        </div>

        <div className="hidden lg:flex items-center space-x-1.5 absolute top-40 right-6 xl:right-20 px-3.5 py-1.5 rounded-2xl bg-white/90 border border-purple-200/80 shadow-md text-xs font-mono text-purple-700 font-semibold animate-float-reverse pointer-events-none select-none backdrop-blur-sm z-10">
          <span className="text-blue-600 font-bold">GROUP BY</span> MAPB
        </div>

        <div className="hidden xl:flex items-center space-x-1.5 absolute bottom-44 left-10 px-3.5 py-1.5 rounded-2xl bg-white/90 border border-emerald-200/80 shadow-md text-xs font-mono text-emerald-700 font-semibold animate-float-reverse pointer-events-none select-none backdrop-blur-sm z-10">
          <span className="text-emerald-600 font-bold">AVG(LUONG)</span> OVER(...)
        </div>

        <div className="hidden xl:flex items-center space-x-1.5 absolute bottom-48 right-12 px-3.5 py-1.5 rounded-2xl bg-white/90 border border-cyan-200/80 shadow-md text-xs font-mono text-cyan-800 font-semibold animate-float-slow pointer-events-none select-none backdrop-blur-sm z-10">
          <span className="text-blue-600 font-bold">INNER JOIN</span> PHONGBAN ON MAPB
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-xs hover:border-[#0284C7]/60 hover:shadow-md transition-all cursor-default backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7] animate-pulse" />
              <span>SQLFlow 2.0 • Nền Tảng Học & Thực Hành SQL Trực Quan</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-blue-50 text-[#0284C7] border border-blue-200">
                Mới
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Làm Chủ Truy Vấn SQL <br />
              <span className="bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] bg-clip-text text-transparent">
                Trực Quan Hóa Từng Dòng Lệnh
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Không cần cài đặt Database server phức tạp. Chúng tôi mang đến <strong>2 trải nghiệm riêng biệt</strong>: Thực hành tự do ngay lập tức, hoặc Đăng nhập để lưu tiến độ và học theo lộ trình bài bản.
            </p>

            {/* DUAL ACTION BUTTONS (The 2 Types of Users) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              
              {/* Type 1: Fast Guest Mode - SQL Playground */}
              <button
                onClick={handleOpenSql}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white border border-slate-800 font-bold text-sm transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-slate-900/20 flex items-center justify-center space-x-3 group cursor-pointer active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 text-[#38BDF8] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Play className="w-4 h-4 fill-[#38BDF8]" />
                </div>
                <div className="text-left">
                  <div className="leading-tight flex items-center space-x-1.5">
                    <span className="font-extrabold text-white text-base">SQL</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-normal">Trình soạn thảo SQL • Không cần đăng nhập</div>
                </div>
              </button>

              {/* Type 2: Full Pro Learner Mode - Học SQL (Chế độ Xem Demo) */}
              <button
                onClick={handleOpenLearn}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:opacity-95 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-[#0284C7]/25 hover:shadow-xl hover:shadow-[#0284C7]/35 flex items-center justify-center space-x-3 group cursor-pointer active:scale-[0.98]"
              >
                <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="leading-tight flex items-center space-x-2">
                    <span className="font-extrabold text-white text-base">Học SQL</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30">
                      Xem Demo
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-[11px] text-white/85 font-normal">Xem trước lộ trình bài bản & quản lý học tập</div>
                </div>
              </button>

            </div>

            {/* Quick Guarantees with Modern Icons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-4 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/60 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>0-Latency In-Browser Engine</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200/60 text-[#0284C7] shadow-2xs">
                <Database className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>CSDL Tiếng Việt 4 Bảng (Đã Nạp Sẵn Data)</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50/80 border border-purple-200/60 text-purple-700 shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Sơ Đồ ERD 120 FPS</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50/80 border border-emerald-200/60 text-emerald-700 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gợi Ý Cú Pháp Thông Minh</span>
              </span>
            </div>

          </div>

          {/* ======================================================== */}
          {/* MODERN HERO SHOWCASE: SQL SANDBOX + 3D DATA CUBE (CỤC DATA) */}
          {/* ======================================================== */}
          <div id="playground-demo" className="mt-12 sm:mt-16 max-w-7xl mx-auto">
            
            {/* Mobile / Tablet Segmented View Switcher */}
            <div className="flex xl:hidden justify-center mb-6">
              <div className="p-1 rounded-2xl bg-slate-200/70 backdrop-blur-md flex items-center space-x-1 text-xs font-bold">
                <button
                  onClick={() => setMobileShowcaseTab('sandbox')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
                    mobileShowcaseTab === 'sandbox'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 text-[#0284C7] fill-[#0284C7]" />
                  <span>Trình Soạn Thảo SQL</span>
                </button>
                <button
                  onClick={() => setMobileShowcaseTab('cube')}
                  className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
                    mobileShowcaseTab === 'cube'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-slate-600 hover:text-purple-700'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-purple-600" />
                  <span>Mô Hình CSDL 3D (Cục Data)</span>
                </button>
              </div>
            </div>

            {/* Main Showcase Grid (Side-by-side on xl: screens, tabbed on mobile) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Left / Column 1: Interactive SQL Sandbox (Col-span 7) */}
              <div className={`xl:col-span-7 ${mobileShowcaseTab === 'sandbox' ? 'block' : 'hidden xl:block'}`}>
                <LiveQueryShowcase onOpenSql={handleOpenSql} />
              </div>

              {/* Right / Column 2: 3D Isometric Database Data Cube (Cục Data DB CTY) (Col-span 5) */}
              <div className={`xl:col-span-5 ${mobileShowcaseTab === 'cube' ? 'block' : 'hidden xl:block'}`}>
                <DatabaseDataCube
                  onExploreSchema={handleOpenSql}
                />
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. DUAL-USER JOURNEY COMPARISON (2 LOẠI NGƯỜI DÙNG) */}
      {/* ======================================================== */}
      <section id="two-modes" className="py-20 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#0284C7] text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>Trải Nghiệm Được Cá Nhân Hóa</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Hai Lựa Chọn Phù Hợp Với Mọi Nhu Cầu
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Bạn chỉ cần kiểm tra nhanh một câu lệnh SQL? Hay muốn theo học một lộ trình chuyên sâu để trở thành Chuyên gia Dữ liệu? Hãy chọn cách bắt đầu của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* OPTION 1: GUEST EXPLORER */}
            <div className="rounded-3xl border-2 border-slate-200 bg-white p-8 flex flex-col justify-between hover:border-[#0284C7]/50 hover:shadow-xl transition-all duration-300 relative group">
              <div className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#0284C7] flex items-center justify-center font-bold">
                    <Play className="w-6 h-6 fill-[#0284C7]" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    Không Cần Đăng Nhập
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Thực Hành Tự Do (Guest)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Dành cho người cần tra cứu, viết thử câu lệnh và kiểm tra kết quả ngay lập tức
                  </p>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Truy cập tức thì:</strong> Vào thẳng IDE không cần điền form, mật khẩu hay email.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Bộ máy SQL In-Browser:</strong> Đầy đủ công cụ thực thi câu lệnh SQL với tốc độ mili-giây.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Sơ đồ CSDL Quan hệ:</strong> Xem cấu trúc bảng, khóa chính (PK), khóa ngoại (FK) trực quan.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Thử nghiệm tự do:</strong> Thực hành các bài tập SQL mẫu mở có sẵn trên hệ thống.</span>
                  </li>
                  <li className="flex items-start space-x-2.5 text-slate-400">
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">—</span>
                    <span>Không lưu lịch sử phiên làm việc, dự án dài hạn hay chuỗi học tập cá nhân.</span>
                  </li>
                </ul>

              </div>

              <div className="pt-8">
                <button
                  onClick={handleOpenSql}
                  className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all active:scale-[0.98] shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Mở SQL Playground</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* OPTION 2: PRO LEARNER & ADMIN */}
            <div className="rounded-3xl border-2 border-[#0284C7] bg-gradient-to-b from-blue-50/30 to-white p-8 flex flex-col justify-between shadow-xl shadow-[#0284C7]/10 relative group">
              
              {/* Recommended Badge / Demo Status */}
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-white fill-white" />
                <span>Bản Xem Demo (Chỉ Đọc)</span>
              </div>

              <div className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center font-bold shadow-md shadow-[#0284C7]/20">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Xem Trước Toàn Bộ Giao Diện
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Học Viên Chuyên Sâu (Account)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Dành cho người theo đuổi lộ trình Data Analyst, Database Admin & Software Engineer
                  </p>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                    <span><strong>Lưu trữ Dự án & Query:</strong> Quản lý bộ sưu tập câu lệnh SQL cá nhân theo từng folder dự án.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                    <span><strong>Lộ trình bài bản 3 Cấp độ:</strong> Từ Foundation, Intermediate đến Advanced Window Functions.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                    <span><strong>Chuỗi Học Tập (Streak & Skill Points):</strong> Theo dõi mục tiêu hàng tuần, tích lũy điểm năng lực.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                    <span><strong>Ghi chú Mentor & Nhận xét:</strong> Nhận phản hồi chuyên môn trực tiếp trên từng bài tập.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
                    <span><strong>Cổng Quản Trị Hệ Thống (Admin Portal):</strong> Quản lý học viên, khóa học, bài tập & audit logs.</span>
                  </li>
                </ul>

              </div>

              <div className="pt-8">
                <button
                  onClick={handleOpenLearn}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:opacity-95 text-white font-bold text-sm transition-all active:scale-[0.98] shadow-md shadow-[#0284C7]/30 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Xem Demo Không Gian Học Tập</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. DEEP FEATURES BENTO GRID */}
      {/* ======================================================== */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0284C7] text-xs font-semibold border border-blue-100">
              <Zap className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Công Nghệ Vượt Trội</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mọi Công Cụ Bạn Cần Để Làm Chủ Dữ Liệu
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Tích hợp công nghệ hiển thị đồ họa tiên tiến và bộ biên dịch SQL thời gian thực chuẩn công nghiệp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Schema Visualizer */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-100/80 text-[#0284C7] flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Sơ Đồ ERD Quan Hệ Tự Động</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tự động phân tích bảng và vẽ mối liên kết khóa ngoại (Foreign Keys) sắc nét. Giúp bạn thấu hiểu cấu trúc dữ liệu trước khi viết JOIN.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-[#0284C7]">
                <span>Tương tác Drag & Zoom</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 2: Step-by-Step Data Flow Visualizer */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-100/80 text-purple-700 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Visualizer Luồng Dữ Liệu</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Xem rõ dữ liệu được lọc qua WHERE, gộp nhóm qua GROUP BY hay tính toán ra sao qua từng bước với các bảng trung gian động.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-purple-700">
                <span>Minh họa từng bước thực thi</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 3: Smart Autocomplete Editor */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-8 flex flex-col justify-between hover:shadow-lg transition">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Monaco Editor Thông Minh</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Gợi ý tên bảng, cột dữ liệu, từ khóa SQL tức thì với phím tắt chuẩn VS Code và chuyển đổi 3 giao diện (One Dark, Dracula, GitHub Light).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-emerald-700">
                <span>Hỗ trợ đa Theme & Format SQL</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* 5. CURRICULUM ROADMAP PREVIEW */}
      {/* ======================================================== */}
      <section id="curriculum" className="py-20 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-14">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#0284C7] text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Lộ Trình Học Tập Chuẩn Quốc Tế</span>
              </div>
              {isCurriculumMaintenance ? (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Đang Bảo Trì • Chỉ Được Xem Trước (View-Only)</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Đang Hoạt Động • Sẵn Sàng Học Tập</span>
                </div>
              )}
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Từ Người Mới Bắt Đầu Tới Chuyên Gia Dữ Liệu
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {isCurriculumMaintenance
                ? 'Được thiết kế theo cấu trúc bài giảng thực chiến. Hệ thống đang bảo trì nâng cấp, bạn có thể xem trước nội dung lộ trình bên dưới.'
                : 'Được thiết kế theo cấu trúc bài giảng thực chiến kèm bài tập tự động chấm điểm. Hệ thống đã mở hoạt động đầy đủ.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Step 1 */}
            <div 
              onClick={() => {
                if (isCurriculumMaintenance) {
                  onTriggerMaintenance?.(
                    'Khóa học 01: SQL Foundation',
                    'Khóa học cơ bản SQL Foundation đang được bảo trì nâng cấp hệ thống. Bạn chỉ có thể xem cấu trúc bài giảng (Chỉ được view thôi nè), tính năng làm bài tập và cấp chứng chỉ sẽ có sau!',
                    'Khóa Học Đang Bảo Trì - Chỉ Xem Trước (View-Only)'
                  );
                } else {
                  handleOpenLearn();
                }
              }}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0284C7] font-bold text-xs flex items-center justify-center border border-blue-200">
                  01
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isCurriculumMaintenance 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {isCurriculumMaintenance ? 'Chỉ xem' : 'Mở học'}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                SQL Foundation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nắm vững nền tảng cơ bản: cú pháp SELECT, điều kiện lọc WHERE, sắp xếp ORDER BY, hàm tổng hợp và gộp nhóm GROUP BY / HAVING.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-500 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>12 Bài học • Dành cho người mới</span>
              </div>
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => {
                if (isCurriculumMaintenance) {
                  onTriggerMaintenance?.(
                    'Khóa học 02: Intermediate SQL & Relational',
                    'Khóa học nâng cao Intermediate SQL đang được bảo trì nâng cấp hệ thống. Bạn chỉ có thể xem cấu trúc bài giảng (Chỉ được view thôi nè), tính năng làm bài tập và cấp chứng chỉ sẽ có sau!',
                    'Khóa Học Đang Bảo Trì - Chỉ Xem Trước (View-Only)'
                  );
                } else {
                  handleOpenLearn();
                }
              }}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0284C7] font-bold text-xs flex items-center justify-center border border-blue-200">
                  02
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isCurriculumMaintenance 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {isCurriculumMaintenance ? 'Chỉ xem' : 'Mở học'}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                Intermediate SQL & Relational
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Liên kết bảng nhiều cấp độ: INNER JOIN, LEFT/RIGHT JOIN, FULL OUTER JOIN, truy vấn con lồng nhau (Subqueries) và bảng tạm WITH CTE.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-500 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>18 Bài học • Luyện tập thực tế</span>
              </div>
            </div>

            {/* Step 3 */}
            <div 
              onClick={() => {
                if (isCurriculumMaintenance) {
                  onTriggerMaintenance?.(
                    'Khóa học 03: Advanced Analytics & Performance',
                    'Khóa học chuyên gia Advanced Analytics đang được bảo trì nâng cấp hệ thống. Bạn chỉ có thể xem cấu trúc bài giảng (Chỉ được view thôi nè), tính năng làm bài tập và cấp chứng chỉ sẽ có sau!',
                    'Khóa Học Đang Bảo Trì - Chỉ Xem Trước (View-Only)'
                  );
                } else {
                  handleOpenLearn();
                }
              }}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0284C7] font-bold text-xs flex items-center justify-center border border-blue-200">
                  03
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isCurriculumMaintenance 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {isCurriculumMaintenance ? 'Chỉ xem' : 'Mở học'}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                Advanced Analytics & Performance
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kỹ thuật phân tích đỉnh cao: Window Functions (ROW_NUMBER, DENSE_RANK, LAG, LEAD), Partitioning, Tối ưu Indexing và phân tích Execution Plan.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-500 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>24 Bài học • Phỏng vấn Data Analyst</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CALL TO ACTION BANNER (BOTTOM) */}
      {/* ======================================================== */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-[#075985] to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.2),transparent_50%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Sẵn Sàng Chinh Phục SQL Ngay Hôm Nay?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Chọn hình thức phù hợp nhất với bạn: Viết query thử nghiệm ngay tức thì không cần đăng nhập, hoặc đăng nhập để lưu trữ dự án và theo đuổi toàn bộ lộ trình.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            
            <button
              onClick={handleOpenSql}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-900 font-extrabold text-base hover:bg-slate-100 transition shadow-lg flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-900" />
              <span>SQL</span>
            </button>

            <button
              onClick={handleOpenLearn}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0284C7] hover:bg-[#0369a1] text-white font-extrabold text-base transition shadow-lg border border-white/20 flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 text-white" />
              <span>Học SQL</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                Xem Demo
              </span>
            </button>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FOOTER */}
      {/* ======================================================== */}
      <footer className="py-12 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-xl bg-[#0284C7] flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-sm">SQLFlow</span>
            <span>— Nền tảng học & thực hành SQL trực quan</span>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={handleOpenSql} className="hover:text-[#0284C7] font-semibold transition cursor-pointer">SQL</button>
            <button onClick={handleOpenLearn} className="hover:text-[#0284C7] font-semibold transition cursor-pointer flex items-center space-x-1">
              <span>Học SQL</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">Demo</span>
            </button>
            <a 
              href="#workspace/admin-roles" 
              className="font-semibold transition flex items-center space-x-1 text-slate-400 hover:text-purple-600 cursor-pointer"
              title="Cổng đăng nhập Quản trị viên"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quản trị viên</span>
            </a>
            <span>© 2026 SQLFlow. All rights reserved.</span>
          </div>

        </div>
      </footer>

      {/* 8. FLOATING SCROLL-TO-TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white text-[#0284C7] hover:bg-blue-50 border border-slate-200 shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-in fade-in zoom-in-75 duration-200 cursor-pointer"
          title="Cuộn lên đầu trang"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

    </div>
  );
};
