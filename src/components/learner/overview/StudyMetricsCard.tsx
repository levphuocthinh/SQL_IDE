import React from 'react';
import { UserProfile } from '../../../types/platform';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Target, 
  TrendingUp 
} from 'lucide-react';

interface StudyMetricsCardProps {
  user: UserProfile;
  weekDays: { day: string; active: boolean; value: number; hours: string }[];
}

/**
 * Thẻ Chỉ số học tập tuần này & Thang đo hoạt động Apple Fitness Style
 */
export const StudyMetricsCard: React.FC<StudyMetricsCardProps> = ({ user, weekDays }) => {
  return (
    <div className="rounded-[32px] bg-[#F8FAFD] border border-slate-200/80 p-5 sm:p-7 shadow-sm flex flex-col justify-between contain-paint font-sans">
      {/* Header Title with live status */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/70">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] ring-2 ring-emerald-500/30" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
            Chỉ số học tập tuần này
          </h3>
        </div>

        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-xs">
          Đang hoạt động 🔥
        </span>
      </div>

      {/* 3x2 Stat Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5 mb-5">
        {/* Pill 1: Streak */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center space-x-3 transition-colors duration-150 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
            <Flame className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-medium truncate">Chuỗi streak</p>
            <p className="text-sm font-bold text-slate-900 tracking-tight">{user.streakDays} ngày</p>
          </div>
        </div>

        {/* Pill 2: Thời lượng */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center space-x-3 transition-colors duration-150 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-medium truncate">Thời lượng</p>
            <p className="text-sm font-bold text-slate-900 tracking-tight">{user.totalHours} giờ</p>
          </div>
        </div>

        {/* Pill 3: Hoàn thành bài */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center space-x-3 transition-colors duration-150 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-medium truncate">Hoàn thành</p>
            <p className="text-sm font-bold text-slate-900 tracking-tight">{user.completedLessons} bài</p>
          </div>
        </div>

        {/* Pill 4: Điểm kỹ năng */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center space-x-3 transition-colors duration-150 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-medium truncate">Điểm kỹ năng</p>
            <p className="text-sm font-bold text-slate-900 tracking-tight">{user.skillPoints} pts</p>
          </div>
        </div>

        {/* Pill 5: Mục tiêu tuần */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center space-x-3 transition-colors duration-150 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 shrink-0">
            <Target className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-medium truncate">Mục tiêu tuần</p>
            <p className="text-sm font-bold text-slate-900 tracking-tight">{user.completedDaysThisWeek}/{user.weeklyGoalDays} ngày</p>
          </div>
        </div>

        {/* Pill 6: Xếp hạng */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center space-x-3 transition-colors duration-150 shadow-sm">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-medium truncate">Thứ hạng</p>
            <p className="text-sm font-bold text-slate-900 tracking-tight">Top 15%</p>
          </div>
        </div>
      </div>

      {/* 7-Day Timeline Bar (Apple Fitness Style) */}
      <div className="pt-3 border-t border-slate-200/70">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
          <span>Hoạt động 7 ngày vừa qua</span>
          <span className="text-slate-900 font-semibold">Đạt 5/7 ngày</span>
        </div>
        
        {/* 7-Day Horizontal Activity Pills */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((item, idx) => (
            <div 
              key={idx}
              className={`h-9 rounded-xl flex flex-col items-center justify-center transition-colors duration-150 ${
                item.active 
                  ? 'bg-gradient-to-t from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20 font-bold' 
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200/70'
              }`}
              title={`${item.day}: ${item.hours}`}
            >
              <span className="text-[10px]">{item.day}</span>
              <span className="text-[8px] opacity-75 font-mono">{item.hours}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
