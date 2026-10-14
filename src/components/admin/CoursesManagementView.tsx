import React, { useState } from 'react';
import { CourseItem } from '../../types/platform';
import { 
  Plus,
  Database,
  ChevronDown,
  ChevronRight,
  X 
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';

interface CoursesManagementViewProps {
  courses: CourseItem[];
  onAddCourse: (newCourse: CourseItem) => void;
}

export const CoursesManagementViewComponent: React.FC<CoursesManagementViewProps> = ({
  courses,
  onAddCourse,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseItem>(courses[0]);
  const [expandedChapter, setExpandedChapter] = useState<string>(courses[0]?.chapters[0]?.id || '');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  // New course form
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [colorTheme, setColorTheme] = useState<'blue' | 'purple' | 'emerald'>('blue');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCourseObj: CourseItem = {
      id: `course-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim() || 'Lộ trình SQL thực chiến',
      badgeText: 'Mới ra mắt',
      colorTheme,
      totalLessons: 10,
      completedLessons: 0,
      progressPercent: 0,
      chapters: [
        {
          id: `ch-${Date.now()}-1`,
          title: 'Chương 1: Kiến thức nền tảng',
          lessons: [
            { id: `l-${Date.now()}-1`, title: 'Giới thiệu & Cài đặt môi trường', durationMinutes: 15, status: 'not_started' },
            { id: `l-${Date.now()}-2`, title: 'Cú pháp SELECT & FROM', durationMinutes: 20, status: 'locked' },
          ],
        },
      ],
    };

    onAddCourse(newCourseObj);
    setTitle('');
    setTagline('');
    setShowAddCourseModal(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F]">
            Quản lý Khóa học & Chương mục
          </h1>
          <p className="text-sm text-[#86868B] font-normal">
            Thiết kế cấu trúc lộ trình học tập, bài học lý thuyết và bài tập thực hành.
          </p>
        </div>

        <button
          onClick={() => setShowAddCourseModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#0071E3] text-white hover:bg-[#0077ED] transition text-xs font-semibold shadow-sm active:scale-[0.98] self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm khóa học mới</span>
        </button>
      </div>

      {/* Course Selector Tabs - Apple Segmented Bar */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedCourse(c);
              if (c.chapters[0]) setExpandedChapter(c.chapters[0].id);
            }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition flex items-center space-x-2 flex-shrink-0 active:scale-95 ${
              selectedCourse.id === c.id
                ? 'bg-[#1D1D1F] text-white shadow-sm'
                : 'bg-white border border-black/[0.08] text-[#1D1D1F] hover:bg-black/[0.03]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{c.title}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCourse.id === c.id ? 'bg-white/20 text-white' : 'bg-black/[0.04] text-[#86868B]'}`}>
              {c.totalLessons} bài
            </span>
          </button>
        ))}
      </div>

      {/* Course Detail Card */}
      <div className="apple-card bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <div>
            <h2 className="text-lg font-bold text-[#1D1D1F] tracking-tight">{selectedCourse.title}</h2>
            <p className="text-xs text-[#86868B]">{selectedCourse.tagline} · {selectedCourse.chapters.length} chương mục</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0071E3]/10 text-[#0071E3] border border-[#0071E3]/15">
            {selectedCourse.badgeText}
          </span>
        </div>

        {/* Chapters & Lessons Accordion */}
        <div className="space-y-3.5">
          {selectedCourse.chapters.map((ch, idx) => {
            const isExpanded = expandedChapter === ch.id;

            return (
              <div key={ch.id} className="border border-black/[0.06] rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setExpandedChapter(isExpanded ? '' : ch.id)}
                  className="w-full p-4 bg-black/[0.015] hover:bg-black/[0.03] transition flex items-center justify-between text-left text-xs font-semibold text-[#1D1D1F]"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span>{ch.title}</span>
                    <span className="text-[11px] text-[#86868B] font-normal">({ch.lessons.length} bài)</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-[#86868B]" /> : <ChevronRight className="w-4 h-4 text-[#86868B]" />}
                </button>

                {isExpanded && (
                  <div className="p-4 divide-y divide-black/[0.04] bg-white">
                    {ch.lessons.map((lesson, lIdx) => (
                      <div key={lesson.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="text-[#86868B] font-mono text-[11px]">{idx + 1}.{lIdx + 1}</span>
                          <span className="font-semibold text-[#1D1D1F]">{lesson.title}</span>
                          <span className="text-[11px] text-[#86868B]">· {lesson.durationMinutes} phút</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/[0.03] text-[#86868B] border border-black/[0.04]">
                            {lesson.status === 'completed' ? 'Đã duyệt' : 'Bản nháp'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Add Course (macOS Sheet) */}
      {showAddCourseModal && (
        <ModalPortal>
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddCourseModal(false);
            }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)] border border-black/[0.08] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.06] mb-4">
              <h3 className="font-bold text-[#1D1D1F] text-base tracking-tight">
                Tạo Khóa học Mới
              </h3>
              <button 
                onClick={() => setShowAddCourseModal(false)}
                className="w-7 h-7 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#86868B] hover:text-[#1D1D1F] flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1D1F]">Tên khóa học *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: SQL cho Data Analyst..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1D1F]">Mô tả ngắn gọn</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Từ phân tích cơ bản đến xây dựng Dashboard..."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1D1D1F]">Màu chủ đạo (Theme)</label>
                <select
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value as any)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition cursor-pointer"
                >
                  <option value="blue">Xanh dương (Blue - Foundation)</option>
                  <option value="purple">Tím (Purple - Advanced)</option>
                  <option value="emerald">Xanh ngọc (Emerald - Performance)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#86868B] hover:bg-black/[0.05] transition active:scale-[0.98]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0071E3] text-white hover:bg-[#0077ED] transition shadow-sm active:scale-[0.98]"
                >
                  Tạo khóa học
                </button>
              </div>
            </form>
          </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

export const CoursesManagementView = React.memo(CoursesManagementViewComponent);
