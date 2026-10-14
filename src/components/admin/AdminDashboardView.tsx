import React from 'react';
import { 
  Users,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Code2,
  ChevronRight 
} from 'lucide-react';
import { StudentManagementItem, AuditLogItem } from '../../types/platform';
import { MaintenanceSettings } from '../../config/maintenance';
import { Wrench } from 'lucide-react';

interface AdminDashboardViewProps {
  students: StudentManagementItem[];
  auditLogs: AuditLogItem[];
  onNavigateToStudents: () => void;
  onNavigateToExercises: () => void;
  onSelectStudent: (student: StudentManagementItem) => void;
  onNavigateToRoles?: () => void;
  maintenanceSettings?: MaintenanceSettings;
}

export const AdminDashboardViewComponent: React.FC<AdminDashboardViewProps> = ({
  students,
  auditLogs,
  onNavigateToStudents,
  onNavigateToExercises,
  onSelectStudent,
  onNavigateToRoles,
  maintenanceSettings,
}) => {
  const activeCount = students.filter(s => s.status === 'active').length;
  const warningCount = students.filter(s => s.status === 'warning').length;
  const blockedCount = students.filter(s => s.status === 'blocked').length;

  const maintenanceCount = maintenanceSettings 
    ? Object.values(maintenanceSettings).filter(Boolean).length 
    : 0;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-purple-600 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              macOS Admin Console
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1D1D1F] mt-1">
            Tổng quan Hệ thống SQLFlow
          </h1>
          <p className="text-sm text-[#86868B] font-normal">
            Giám sát thời gian thực hoạt động học tập, tiến độ khóa học và bảo mật hệ thống.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {onNavigateToRoles && (
            <button
              onClick={onNavigateToRoles}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition shadow-xs active:scale-[0.98] cursor-pointer"
              title="Mở bảng điều khiển Bật/Tắt bảo trì từng trang"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-700" />
              <span>Quản lý Bảo trì Trang</span>
              {maintenanceCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                  {maintenanceCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onNavigateToStudents}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold transition shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Xem danh sách học viên</span>
          </button>
        </div>
      </div>

      {/* 2. Admin 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Tổng học viên */}
        <div className="apple-card bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-[#86868B] font-medium">Tổng học viên</p>
            <h3 className="text-2xl font-bold text-[#1D1D1F] font-mono">{students.length * 240 + 48}</h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center pt-0.5">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+14% so với tháng trước</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] border border-[#0071E3]/15 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Đang hoạt động */}
        <div className="apple-card bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-[#86868B] font-medium">Đang hoạt động tuần này</p>
            <h3 className="text-2xl font-bold text-[#1D1D1F] font-mono">892</h3>
            <p className="text-[11px] text-[#86868B] pt-0.5">{activeCount} học viên tích cực</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Bài tập đã giải hôm nay */}
        <div className="apple-card bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-[#86868B] font-medium">Bài tập nộp hôm nay</p>
            <h3 className="text-2xl font-bold text-[#1D1D1F] font-mono">342</h3>
            <p className="text-[11px] text-[#0071E3] font-semibold pt-0.5">Tỷ lệ pass: 91.2%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 border border-purple-500/15 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Cần hỗ trợ (Bị kẹt) */}
        <div className="apple-card bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-[#86868B] font-medium">Học viên bị kẹt bài</p>
            <h3 className="text-2xl font-bold text-amber-600 font-mono">{warningCount + 12}</h3>
            <p className="text-[11px] text-rose-500 font-semibold pt-0.5">{blockedCount} tài khoản bị khóa</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/15 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Two Columns: Stuck Students Alert & Recent Audit Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Học viên cần trợ giúp / Đang bị kẹt */}
        <div className="apple-card bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.06]">
            <div>
              <h3 className="font-bold text-[#1D1D1F] text-sm tracking-tight">Học viên đang cần hỗ trợ</h3>
              <p className="text-xs text-[#86868B]">Danh sách học viên gặp lỗi cú pháp liên tục hoặc dừng học lâu ngày</p>
            </div>
            <button
              onClick={onNavigateToStudents}
              className="text-xs font-semibold text-[#0071E3] hover:underline flex items-center space-x-1"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {students.filter(s => s.status !== 'active' || s.stuckLessonTitle).map((student) => (
              <div
                key={student.id}
                className="p-3.5 rounded-2xl border border-black/[0.04] bg-black/[0.015] hover:bg-black/[0.03] transition flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-amber-500/15 text-amber-700 font-bold flex items-center justify-center text-xs">
                    {student.avatarText}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1D1D1F]">{student.name}</h4>
                    <p className="text-[11px] text-[#86868B]">
                      Bị kẹt ở: <span className="text-amber-700 font-semibold">{student.stuckLessonTitle || 'LEFT JOIN & NULL'}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectStudent(student)}
                  className="px-4 py-1.5 rounded-full bg-white border border-black/[0.08] hover:border-[#0071E3] text-[#0071E3] font-semibold text-xs shadow-sm transition active:scale-95"
                >
                  Hỗ trợ
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Hoạt động hệ thống gần đây */}
        <div className="apple-card bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.06]">
            <div>
              <h3 className="font-bold text-[#1D1D1F] text-sm tracking-tight">Nhật ký Audit gần nhất</h3>
              <p className="text-xs text-[#86868B]">Theo dõi các thao tác quản trị viên và thay đổi nhạy cảm</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Live
            </span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl border border-black/[0.04] bg-white hover:bg-black/[0.015] transition text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1D1D1F]">{log.action}</span>
                  <span className="text-[10px] text-[#86868B] font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[#86868B] text-[11px] truncate">
                  <strong className="text-[#1D1D1F] font-semibold">{log.actorName}</strong> ({log.actorRole}): {log.target}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboardView = React.memo(AdminDashboardViewComponent);
