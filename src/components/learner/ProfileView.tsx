import React, { useState } from 'react';
import { UserProfile } from '../../types/platform';
import { 
  Flame,
  Trophy,
  CheckCircle2,
  Calendar,
  Zap,
  Target,
  ShieldCheck,
  User,
  Save 
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileViewComponent: React.FC<ProfileViewProps> = ({
  user,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [weeklyGoal, setWeeklyGoal] = useState(String(user.weeklyGoalDays));
  const [level, setLevel] = useState(user.level);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      weeklyGoalDays: Number(weeklyGoal) || 5,
      level,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const badges = [
    { title: '7 Days Streak', icon: Flame, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', desc: 'Học 7 ngày liên tục không nghỉ' },
    { title: 'Query Master', icon: Zap, color: 'text-[#0071E3] bg-[#0071E3]/10 border-[#0071E3]/20', desc: 'Chạy thành công hơn 50 truy vấn' },
    { title: 'Data Explorer', icon: Target, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', desc: 'Hoàn thành khóa SQL Foundation' },
    { title: 'Window Specialist', icon: Trophy, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', desc: 'Giải bài tập DENSE_RANK & LAG' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto font-sans">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/[0.04] border border-black/[0.06] text-[#86868B] text-[11px] font-semibold">
          <User className="w-3.5 h-3.5 text-[#0071E3]" />
          <span>Tài khoản Apple ID & Cài đặt</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Hồ sơ Cá nhân
        </h1>
        <p className="text-sm text-[#86868B] font-normal">
          Quản lý thông tin tài khoản học viên, chỉ số thành tích và mục tiêu học tập.
        </p>
      </div>

      {/* 2-Column macOS System Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Apple ID User Card (Span 1) */}
        <div className="apple-card rounded-3xl p-8 border border-black/[0.06] bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col items-center text-center space-y-6">
          {/* Avatar Circle with subtle ring */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0071E3] to-[#47A4FF] p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#0071E3] font-bold text-2xl">
                {user.avatarText}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Name & Role */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
              {user.name}
            </h2>
            <p className="text-xs text-[#86868B] font-medium font-mono">
              {user.email}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Học viên Tích cực</span>
              </span>
            </div>
          </div>

          {/* 2 Stat Inset Boxes */}
          <div className="w-full grid grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#1D1D1F] font-mono">{user.streakDays}</span>
              <span className="text-[11px] text-[#86868B] font-medium mt-0.5">Ngày liên tục</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#1D1D1F] font-mono">8</span>
              <span className="text-[11px] text-[#86868B] font-medium mt-0.5">Dự án lưu</span>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="w-full pt-4 border-t border-black/[0.06] space-y-3 text-left">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B] px-1">
              Huy hiệu đã đạt ({badges.length})
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {badges.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className={`p-3 rounded-2xl border text-xs flex items-center space-x-2.5 ${b.color}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-semibold truncate text-[11px]">{b.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: macOS System Settings Form (Span 2) */}
        <div className="lg:col-span-2 apple-card rounded-3xl p-8 border border-black/[0.06] bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
              <div>
                <h3 className="font-bold text-[#1D1D1F] text-lg tracking-tight">
                  Thông tin Tài khoản
                </h3>
                <p className="text-xs text-[#86868B] font-normal">Cập nhật hồ sơ để đồng bộ tiến độ và mục tiêu cá nhân</p>
              </div>

              {savedSuccess && (
                <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã lưu thành công!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Họ và tên */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
                    placeholder="Nhập họ và tên..."
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    Email Apple ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
                    placeholder="Nhập email..."
                  />
                </div>

                {/* Mục tiêu học mỗi tuần */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    Mục tiêu học mỗi tuần (ngày)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={weeklyGoal}
                    onChange={(e) => setWeeklyGoal(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
                    placeholder="5"
                  />
                </div>

                {/* Trình độ hiện tại */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    Trình độ hiện tại
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition cursor-pointer"
                  >
                    <option value="Beginner">Người mới bắt đầu (Beginner)</option>
                    <option value="Intermediate">Trung cấp (Intermediate)</option>
                    <option value="Advanced">Nâng cao (Advanced)</option>
                  </select>
                </div>
              </div>

              {/* Action Button - Apple Blue Pill */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#0071E3] text-white hover:bg-[#0077ED] transition font-semibold text-xs shadow-sm active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          </div>

          {/* Apple Fitness Activity Summary Card */}
          <div className="p-5 rounded-2xl bg-[#0071E3]/5 border border-[#0071E3]/15 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-[#1D1D1F]">Cam kết học tập: {weeklyGoal} ngày/tuần</p>
                <p className="text-[11px] text-[#86868B]">Đã hoàn thành {user.completedDaysThisWeek}/{weeklyGoal} ngày trong tuần này.</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#0071E3] bg-white px-3.5 py-1.5 rounded-full border border-black/[0.06] shadow-sm">
              Đạt 100%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileView = React.memo(ProfileViewComponent);
