import React, { useState } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

interface CourseFanDeckProps {
  onViewCourses: () => void;
  onStartLesson: () => void;
}

/**
 * Hiệu ứng Xòe quạt các khóa học (Fan-out interactive cards)
 * Cho phép xem nhanh các lộ trình học tập và độ hoàn thành
 */
export const CourseFanDeck: React.FC<CourseFanDeckProps> = ({
  onViewCourses,
  onStartLesson,
}) => {
  const [isCoursesFanHovered, setIsCoursesFanHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsCoursesFanHovered(true)}
      onMouseLeave={() => setIsCoursesFanHovered(false)}
      className="rounded-[32px] bg-[#F8FAFD] border border-slate-200/80 p-5 sm:p-7 shadow-sm flex flex-col justify-between overflow-hidden group font-sans"
    >
      {/* Header Title with action button */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200/70">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Các khóa học
          </span>
        </div>

        <button 
          onClick={onViewCourses}
          className="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-300/70 flex items-center justify-center text-slate-700 transition-colors duration-150 cursor-pointer"
          title="Xem toàn bộ khóa học"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Fan-Out Cards (GPU transform only) */}
      <div className="relative py-6 flex items-center justify-center h-40">
        
        {/* Left Card: SQL BI & Analytics */}
        <div 
          onClick={onViewCourses}
          style={{
            transform: isCoursesFanHovered 
              ? 'translate3d(-42px, -8px, 0) rotate(-16deg)' 
              : 'translate3d(-22px, 0, 0) rotate(-9deg)',
          }}
          className="w-32 sm:w-36 h-40 rounded-2xl bg-gradient-to-br from-purple-800 to-indigo-950 border border-purple-400/30 p-3.5 flex flex-col justify-between text-white shadow-xl cursor-pointer transition-transform duration-250 ease-out transform-gpu absolute"
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs">
              📊
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200">
              Nâng cao
            </span>
          </div>
          <div>
            <p className="text-[10px] text-purple-200 font-mono">LỘ TRÌNH</p>
            <p className="text-xs font-bold leading-tight line-clamp-2">SQL BI & Analytics</p>
            <p className="text-[9px] text-slate-300 mt-1">15 bài học</p>
          </div>
        </div>

        {/* Center Active Card: SQL Foundation */}
        <div 
          onClick={onStartLesson}
          style={{
            transform: isCoursesFanHovered 
              ? 'translate3d(0, -16px, 0) scale(1.06)' 
              : 'translate3d(0, 0, 0) scale(1)',
          }}
          className="w-32 sm:w-36 h-40 rounded-2xl bg-gradient-to-br from-[#0071E3] to-[#1E3A8A] border border-cyan-400/40 ring-1 ring-cyan-400/30 p-3.5 flex flex-col justify-between text-white shadow-2xl z-20 cursor-pointer transition-transform duration-250 ease-out transform-gpu absolute"
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs">
              ⚡
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-400/30 text-cyan-200">
              42%
            </span>
          </div>
          <div>
            <p className="text-[10px] text-cyan-200 font-mono">ĐANG HỌC</p>
            <p className="text-xs font-bold leading-tight line-clamp-2">SQL Foundation</p>
            <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden my-1">
              <div className="w-[42%] h-full bg-cyan-300 rounded-full" />
            </div>
            <p className="text-[9px] text-cyan-200 font-semibold">8/12 bài</p>
          </div>
        </div>

        {/* Right Card: Database Indexing */}
        <div 
          onClick={onViewCourses}
          style={{
            transform: isCoursesFanHovered 
              ? 'translate3d(42px, -8px, 0) rotate(16deg)' 
              : 'translate3d(22px, 0, 0) rotate(9deg)',
          }}
          className="w-32 sm:w-36 h-40 rounded-2xl bg-gradient-to-br from-emerald-800 to-slate-950 border border-emerald-400/30 p-3.5 flex flex-col justify-between text-white shadow-xl cursor-pointer transition-transform duration-250 ease-out transform-gpu absolute"
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs">
              🚀
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200">
              Trung cấp
            </span>
          </div>
          <div>
            <p className="text-[10px] text-emerald-200 font-mono">TỐI ƯU</p>
            <p className="text-xs font-bold leading-tight line-clamp-2">Database Indexing</p>
            <p className="text-[9px] text-slate-300 mt-1">10 bài học</p>
          </div>
        </div>
      </div>

      {/* Bottom hint text */}
      <div className="text-center pt-2 relative z-20">
        <span className="text-[11px] text-slate-500 font-medium group-hover:text-slate-800 transition-colors duration-150">
          Di chuột để xòe các khóa học & chọn lộ trình
        </span>
      </div>
    </div>
  );
};
