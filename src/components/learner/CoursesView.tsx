import React, { useState } from 'react';
import { CourseItem } from '../../types/platform';
import { 
  Database,
  CheckCircle2,
  Lock,
  X,
  ChevronRight,
  BookOpen 
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';

interface CoursesViewProps {
  courses: CourseItem[];
  onSelectLesson: (lessonId: string) => void;
  isMaintenance?: boolean;
  onTriggerMaintenance?: (feature?: string, description?: string) => void;
}

export const CoursesViewComponent: React.FC<CoursesViewProps> = ({
  courses,
  onSelectLesson,
  isMaintenance = false,
  onTriggerMaintenance,
}) => {
  const [activeCourseModal, setActiveCourseModal] = useState<CourseItem | null>(null);

  const getHeaderGradient = (theme: 'blue' | 'purple' | 'emerald') => {
    switch (theme) {
      case 'blue': return 'bg-gradient-to-br from-[#0071E3] via-[#2F8BFD] to-[#54A4FF]';
      case 'purple': return 'bg-gradient-to-br from-[#7B3FE4] via-[#9055F6] to-[#B37EF8]';
      case 'emerald': return 'bg-gradient-to-br from-[#008779] via-[#05A492] to-[#30B0C7]';
      default: return 'bg-gradient-to-br from-[#0071E3] to-[#47A4FF]';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto font-sans">
      {/* 1. Apple Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#0071E3]/10 border border-[#0071E3]/15 text-[#0071E3] text-[11px] font-semibold tracking-wide">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Lộ trình Học tập Toàn diện</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Khóa học SQL
        </h1>
        <p className="text-sm text-[#86868B] font-normal">
          Lộ trình kiến trúc chuẩn quốc tế từ cơ bản đến tối ưu hóa truy vấn doanh nghiệp.
        </p>
      </div>

      {/* 2. Apple Arcade / Fitness Style Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isFoundation = course.id === 'course-foundation';

          return (
            <div
              key={course.id}
              className="apple-card rounded-3xl border border-black/[0.06] bg-white shadow-[0_2px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Vibrant Apple Gradient Header Banner */}
              <div className={`${getHeaderGradient(course.colorTheme)} p-6 text-white flex flex-col justify-between h-40 relative overflow-hidden`}>
                <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-md shadow-inner">
                  <Database className="w-5 h-5 text-white" />
                </div>

                <div className="relative z-10 space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
                    {course.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px] text-white/80 font-medium">
                    <span>{course.totalLessons} bài học</span>
                    <span>•</span>
                    <span>{course.progressPercent}% hoàn thành</span>
                  </div>
                </div>

                {/* Subtle background decoration */}
                <div className="absolute -right-4 -bottom-6 opacity-15 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <Database className="w-32 h-32" />
                </div>
              </div>

              {/* Card Body with Apple layout */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <p className="text-xs text-[#86868B] font-medium leading-relaxed">
                    {course.tagline}
                  </p>

                  {/* Apple Fitness Style Progress Indicator */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#1D1D1F]">
                      <span className="text-[#86868B]">Tiến độ học tập</span>
                      <span className="font-mono text-[#0071E3]">{course.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-black/[0.04] rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-[#0071E3] to-[#47A4FF] rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action button - Apple Pill */}
                {isFoundation ? (
                  <button
                    onClick={() => setActiveCourseModal(course)}
                    className="w-full py-2.5 rounded-full bg-[#0071E3] text-white hover:bg-[#0077ED] transition font-semibold text-xs shadow-sm active:scale-[0.98] flex items-center justify-center space-x-1.5"
                  >
                    <span>Tiếp tục học</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveCourseModal(course)}
                    className="w-full py-2.5 rounded-full bg-black/[0.04] border border-black/[0.06] text-[#1D1D1F] hover:bg-black/[0.07] font-semibold text-xs transition active:scale-[0.98] flex items-center justify-center space-x-1.5"
                  >
                    <span>Xem giáo trình</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#86868B]" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Detailed Course Syllabus Modal (macOS Sheet Style with Full Screen Portal) */}
      {activeCourseModal && (
        <ModalPortal>
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveCourseModal(null);
            }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-[0_24px_70px_rgba(0,0,0,0.3)] border border-black/[0.08] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className={`${getHeaderGradient(activeCourseModal.colorTheme)} p-6 text-white flex items-center justify-between`}>
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{activeCourseModal.title}</h3>
                  <p className="text-xs text-white/85 font-medium">{activeCourseModal.tagline} · {activeCourseModal.progressPercent}% hoàn thành</p>
                </div>
              </div>
              <button
                onClick={() => setActiveCourseModal(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chapters & Lessons List (macOS Grouped List) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeCourseModal.chapters.map((chapter) => (
                <div key={chapter.id} className="space-y-3">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B] px-1">
                    {chapter.title}
                  </h4>

                  <div className="space-y-2">
                    {chapter.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition ${
                          lesson.status === 'completed'
                            ? 'bg-emerald-50/50 border-emerald-200/60'
                            : lesson.status === 'in_progress'
                            ? 'bg-[#0071E3]/5 border-[#0071E3]/20 shadow-sm'
                            : lesson.status === 'locked'
                            ? 'bg-black/[0.02] border-black/[0.04] opacity-55'
                            : 'bg-white border-black/[0.06] hover:border-black/[0.12]'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5">
                          {lesson.status === 'completed' ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          ) : lesson.status === 'in_progress' ? (
                            <div className="w-5 h-5 rounded-full bg-[#0071E3] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                              ▶
                            </div>
                          ) : lesson.status === 'locked' ? (
                            <div className="w-5 h-5 rounded-full bg-black/[0.04] text-[#86868B] flex items-center justify-center">
                              <Lock className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-black/[0.15] flex-shrink-0" />
                          )}

                          <div>
                            <span className="font-semibold text-[#1D1D1F]">{lesson.title}</span>
                            <span className="text-[11px] text-[#86868B] ml-2">({lesson.durationMinutes} phút)</span>
                          </div>
                        </div>

                        {lesson.status !== 'locked' ? (
                          <button
                            onClick={() => {
                              if (isMaintenance) {
                                onTriggerMaintenance?.(
                                  `Bài học: ${lesson.title}`,
                                  'Nội dung thực hành và chấm điểm bài tập đang tạm khóa để bảo trì nâng cấp hệ thống.'
                                );
                                return;
                              }
                              setActiveCourseModal(null);
                              onSelectLesson(lesson.id);
                            }}
                            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1D1D1F] text-white hover:bg-[#0071E3] transition active:scale-95 shadow-sm cursor-pointer"
                          >
                            {lesson.status === 'completed' ? 'Ôn lại' : 'Vào học'}
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-[#86868B] px-2 py-0.5 rounded-md bg-black/[0.04]">
                            Khóa
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

export const CoursesView = React.memo(CoursesViewComponent);
