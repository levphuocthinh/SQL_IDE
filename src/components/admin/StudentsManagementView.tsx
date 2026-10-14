import React, { useState } from 'react';
import { StudentManagementItem } from '../../types/platform';
import { 
  Search,
  Filter,
  Lock,
  Unlock,
  KeyRound,
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  Flame 
} from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';

interface StudentsManagementViewProps {
  students: StudentManagementItem[];
  selectedStudent: StudentManagementItem | null;
  onSelectStudent: (student: StudentManagementItem | null) => void;
  onToggleBlockStudent: (studentId: string) => void;
  onResetPasswordStudent: (studentId: string) => void;
  onAddSupportNote: (studentId: string, noteContent: string) => void;
}

export const StudentsManagementViewComponent: React.FC<StudentsManagementViewProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  onToggleBlockStudent,
  onResetPasswordStudent,
  onAddSupportNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'warning' | 'blocked'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [newNote, setNewNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || s.currentCourseTitle === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !newNote.trim()) return;
    onAddSupportNote(selectedStudent.id, newNote.trim());
    setNewNote('');
    showToast('Đã thêm ghi chú hỗ trợ thành công!');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto font-sans">
      {/* Toast Notification (macOS Pill) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1D1F]/90 backdrop-blur-xl text-white px-5 py-3 rounded-full shadow-[0_16px_36px_rgba(0,0,0,0.25)] flex items-center space-x-2.5 border border-white/10 animate-in fade-in slide-in-from-bottom-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F]">
          Quản lý Học viên
        </h1>
        <p className="text-sm text-[#86868B] font-normal">
          Theo dõi tiến độ, can thiệp hỗ trợ học viên bị kẹt và quản lý tài khoản theo quyền hạn.
        </p>
      </div>

      {/* Search & Filter Toolbar - Apple Card */}
      <div className="apple-card bg-white p-4 rounded-3xl border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo họ tên hoặc email học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-2.5 px-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white font-medium text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 transition cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang học (Active)</option>
            <option value="warning">Cảnh báo / Bị kẹt (Warning)</option>
            <option value="blocked">Đã khóa (Blocked)</option>
          </select>

          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="py-2.5 px-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white font-medium text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 transition cursor-pointer"
          >
            <option value="all">Tất cả khóa học</option>
            <option value="SQL Foundation">SQL Foundation</option>
            <option value="Advanced SQL">Advanced SQL</option>
            <option value="SQL Performance">SQL Performance</option>
          </select>
        </div>
      </div>

      {/* Students Table - Apple Numbers Data Grid */}
      <div className="apple-card bg-white rounded-3xl border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F5F7]/80 border-b border-black/[0.06] text-[#86868B] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Học viên</th>
                <th className="py-3.5 px-3">Trạng thái</th>
                <th className="py-3.5 px-3">Khóa đang học</th>
                <th className="py-3.5 px-3">Tiến độ</th>
                <th className="py-3.5 px-3">Chuỗi ngày</th>
                <th className="py-3.5 px-3">Hoạt động cuối</th>
                <th className="py-3.5 px-3">Điểm</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] font-medium text-[#1D1D1F]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#86868B] italic">
                    Không tìm thấy học viên nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const progressPct = Math.round((stu.completedLessons / stu.totalLessons) * 100);

                  return (
                    <tr key={stu.id} className="hover:bg-black/[0.015] transition">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#0071E3]/15 text-[#0071E3] font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {stu.avatarText}
                          </div>
                          <div>
                            <span className="font-semibold text-[#1D1D1F] block">{stu.name}</span>
                            <span className="text-[11px] text-[#86868B] font-mono">{stu.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {stu.status === 'active' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Đang học
                          </span>
                        ) : stu.status === 'warning' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Cần hỗ trợ
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            Đã khóa
                          </span>
                        )}
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-3 text-[#1D1D1F]">
                        {stu.currentCourseTitle}
                      </td>

                      {/* Progress */}
                      <td className="py-3.5 px-3">
                        <div className="w-24 space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-[#86868B]">
                            <span>{stu.completedLessons}/{stu.totalLessons}</span>
                            <span className="text-[#0071E3] font-mono">{progressPct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-black/[0.04] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#0071E3] to-[#47A4FF] rounded-full" style={{ width: `${progressPct}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-3">
                        <span className="flex items-center space-x-1 text-[#1D1D1F]">
                          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span>{stu.streakDays} ngày</span>
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-3 text-[#86868B] text-[11px]">
                        {stu.lastActive}
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-3 font-semibold text-[#1D1D1F] font-mono">
                        {stu.skillPoints.toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => onSelectStudent(stu)}
                          className="px-3.5 py-1.5 rounded-full bg-[#0071E3]/10 hover:bg-[#0071E3]/20 text-[#0071E3] font-semibold text-xs transition active:scale-95"
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal / macOS Sheet */}
      {selectedStudent && (
        <ModalPortal>
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) onSelectStudent(null);
            }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-[0_24px_70px_rgba(0,0,0,0.2)] border border-black/[0.08] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-[#1D1D1F] via-[#2A2B30] to-[#1D1D1F] text-white flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#64D2FF] font-bold text-base shadow-inner">
                  {selectedStudent.avatarText}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">{selectedStudent.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      selectedStudent.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                      selectedStudent.status === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {selectedStudent.status === 'active' ? 'Đang học' : selectedStudent.status === 'warning' ? 'Bị kẹt' : 'Đã khóa'}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 mt-0.5 font-mono">{selectedStudent.email} · Hoạt động cuối: {selectedStudent.lastActive}</p>
                </div>
              </div>
              <button
                onClick={() => onSelectStudent(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Tabs / Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Quick Actions Bar */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2.5">
                  {/* Lock / Unlock Account Button */}
                  <button
                    onClick={() => {
                      onToggleBlockStudent(selectedStudent.id);
                      showToast(selectedStudent.status === 'blocked' ? 'Đã mở khóa tài khoản thành công!' : 'Đã khóa tài khoản học viên.');
                    }}
                    className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full font-semibold transition shadow-sm active:scale-[0.98] ${
                      selectedStudent.status === 'blocked'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    {selectedStudent.status === 'blocked' ? (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Mở khóa tài khoản</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Khóa tài khoản</span>
                      </>
                    )}
                  </button>

                  {/* Reset Password Button */}
                  <button
                    onClick={() => {
                      onResetPasswordStudent(selectedStudent.id);
                      showToast(`Đã gửi email đặt lại mật khẩu đến ${selectedStudent.email}`);
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white border border-black/[0.08] hover:bg-black/[0.03] font-semibold text-[#1D1D1F] transition active:scale-[0.98]"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#0071E3]" />
                    <span>Đặt lại mật khẩu</span>
                  </button>
                </div>

                <div className="text-[11px] text-[#86868B] font-medium">
                  {selectedStudent.projectsCount} dự án SQL đã tạo
                </div>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 rounded-2xl border border-black/[0.06] bg-white">
                  <span className="text-xl font-bold text-[#1D1D1F] block font-mono">{selectedStudent.completedLessons}</span>
                  <span className="text-[11px] text-[#86868B] font-medium">Bài đã hoàn thành</span>
                </div>
                <div className="p-4 rounded-2xl border border-black/[0.06] bg-white">
                  <span className="text-xl font-bold text-[#0071E3] block font-mono">{selectedStudent.streakDays}</span>
                  <span className="text-[11px] text-[#86868B] font-medium">Chuỗi ngày hiện tại</span>
                </div>
                <div className="p-4 rounded-2xl border border-black/[0.06] bg-white">
                  <span className="text-xl font-bold text-purple-600 block font-mono">{selectedStudent.skillPoints}</span>
                  <span className="text-[11px] text-[#86868B] font-medium">Điểm tích lũy</span>
                </div>
              </div>

              {/* Enrolled Courses & Stuck Lesson */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B] px-1">
                  Khóa học & Bài học bị kẹt
                </h4>
                <div className="p-4 rounded-2xl border border-black/[0.06] bg-white space-y-2 text-xs">
                  <p><strong className="text-[#1D1D1F]">Khóa đã đăng ký:</strong> {selectedStudent.enrolledCourseTitles.join(', ')}</p>
                  {selectedStudent.stuckLessonTitle && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Đang bị kẹt ở bài: <strong className="font-semibold">{selectedStudent.stuckLessonTitle}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Support Notes Section */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B] px-1">
                  Ghi chú hỗ trợ của Giảng viên ({selectedStudent.supportNotes.length})
                </h4>

                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {selectedStudent.supportNotes.length === 0 ? (
                    <p className="text-xs text-[#86868B] italic">Chưa có ghi chú hỗ trợ nào.</p>
                  ) : (
                    selectedStudent.supportNotes.map((note) => (
                      <div key={note.id} className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.04] text-xs">
                        <div className="flex items-center justify-between font-semibold text-[#1D1D1F] text-[11px] mb-1">
                          <span>{note.author}</span>
                          <span className="text-[#86868B] font-normal">{note.date}</span>
                        </div>
                        <p className="text-[#86868B]">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleNoteSubmit} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Viết ghi chú hỗ trợ học viên này..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 text-xs p-3 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#0071E3] text-white rounded-full hover:bg-[#0077ED] transition text-xs font-semibold flex items-center space-x-1.5 shadow-sm active:scale-[0.98]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

export const StudentsManagementView = React.memo(StudentsManagementViewComponent);
