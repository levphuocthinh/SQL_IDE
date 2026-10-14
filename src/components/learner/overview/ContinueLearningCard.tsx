import React from 'react';
import { UserProfile, CourseItem } from '../../../types/platform';
import { Play, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ContinueLearningCardProps {
  user: UserProfile;
  currentCourse: CourseItem | null;
  onStartLesson: () => void;
}

/**
 * Thẻ Tiếp tục học tập (Continue Learning Card)
 * Hiển thị tiến độ bài học hiện tại của học viên cùng khung Terminal xem trước câu lệnh SQL thực hành
 */
export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  user,
  currentCourse,
  onStartLesson,
}) => {
  return (
    <div 
      onClick={onStartLesson}
      className="group relative rounded-[32px] bg-white border border-slate-200/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-100/50 via-cyan-50/30 to-transparent rounded-full blur-2xl pointer-events-none -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500" />

      {/* Top Header & Terminal Preview */}
      <div className="relative z-10 space-y-4">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-[#0071E3] bg-[#0071E3]/10 px-3 py-1 rounded-full border border-[#0071E3]/20 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse" />
              <span>Tiếp tục học tập</span>
            </span>

            <span className="text-xs text-slate-500 font-medium">
              Khóa: {currentCourse?.title || 'SQL Nâng Cao & Tối Ưu Hóa Truy Vấn'}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Chương 3 · Bài 8
          </span>
        </div>

        {/* Lesson Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] tracking-tight group-hover:text-[#0071E3] transition-colors">
            {user.currentLessonTitle || 'GROUP BY & HAVING: Nhóm và Lọc dữ liệu tổng hợp'}
          </h2>
          <p className="text-xs sm:text-sm text-[#86868B] mt-1 max-w-xl">
            Luyện tập cách kết hợp các hàm COUNT, SUM, AVG cùng mệnh đề HAVING để lọc các nhóm đạt điều kiện.
          </p>
        </div>

        {/* Sleek Terminal Code Preview Box */}
        <div className="rounded-2xl bg-[#0D0F18] border border-slate-800 p-4 text-xs font-mono shadow-inner group-hover/term:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-slate-400 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              <span className="pl-1 text-slate-300 font-bold">query_preview.sql</span>
            </div>
            <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
              Live Preview
            </span>
          </div>

          <div className="space-y-1 text-slate-300 leading-relaxed font-mono">
            <div>
              <span className="text-purple-400 font-bold">SELECT </span>
              <span className="text-slate-200">department, </span>
              <span className="text-amber-300">AVG(salary) </span>
              <span className="text-blue-300">AS </span>
              <span className="text-slate-200">avg_sal</span>
            </div>
            <div>
              <span className="text-purple-400 font-bold">FROM </span>
              <span className="text-slate-200">employees</span>
            </div>
            <div>
              <span className="text-purple-400 font-bold">GROUP BY </span>
              <span className="text-slate-200">department</span>
            </div>
            <div>
              <span className="text-cyan-400 font-bold">HAVING </span>
              <span className="text-amber-300">AVG(salary) </span>
              <span className="text-purple-300">&gt;= 45000;</span>
            </div>
          </div>

          {/* Execution Status Result Pill */}
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
            <span className="text-emerald-400 font-medium flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>✓ 4 rows in 12ms</span>
            </span>
            <span className="text-cyan-300 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Chạy thử ngay</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Command Action Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200/80 mt-4">
        <div className="flex items-center space-x-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#0071E3] to-[#0A84FF] hover:from-[#0077ED] hover:to-[#0EA5E9] text-white shadow-md shadow-blue-500/25 transition-all duration-150 transform-gpu active:scale-95 group/pill">
          <div className="w-6 h-6 rounded-full bg-white text-[#0071E3] flex items-center justify-center shadow-sm">
            <Play className="w-3.5 h-3.5 fill-[#0071E3] ml-0.5" />
          </div>
          <span className="text-xs sm:text-sm font-bold">
            Vào học ngay: <span className="font-extrabold underline decoration-white/40">{user.currentLessonTitle?.split(':')[0] || 'GROUP BY & HAVING'}</span>
          </span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover/pill:translate-x-1 transition-transform" />
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs text-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <span className="font-semibold">{currentCourse?.progressPercent || 70}% hoàn thành</span>
            <span className="text-slate-400 pl-1 border-l border-slate-200">Bài 8/12</span>
          </div>
        </div>
      </div>
    </div>
  );
};
