import React, { useState } from 'react';
import { RoleConfig } from '../../types/platform';
import { defaultRoles, allPermissionDefinitions } from '../../mock/platformData';
import { 
  MaintenanceSettings, 
  MAINTENANCE_PAGES_META 
} from '../../config/maintenance';
import { 
  ShieldCheck,
  Check,
  X,
  CheckCircle2,
  Wrench,
  Power,
  BookOpen,
  GraduationCap,
  Code2,
  FolderGit2,
  Compass,
  Database,
  Sparkles,
  Info
} from 'lucide-react';

interface RolesManagementViewProps {
  onLogAudit?: (action: string, target: string) => void;
  maintenanceSettings?: MaintenanceSettings;
  onTogglePageMaintenance?: (pageId: keyof MaintenanceSettings, enabled?: boolean) => void;
  onSetAllMaintenance?: (enable: boolean) => void;
}

// Map icon name to Lucide Icon component
const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  GraduationCap,
  Code2,
  FolderGit2,
  Compass,
  Database,
};

export const RolesManagementViewComponent: React.FC<RolesManagementViewProps> = ({
  onLogAudit,
  maintenanceSettings = {
    curriculum: true,
    courses: true,
    practice: true,
    projects: true,
    workspace: true,
    sqlPlayground: false,
  },
  onTogglePageMaintenance,
  onSetAllMaintenance,
}) => {
  const [roles, setRoles] = useState<RoleConfig[]>(defaultRoles);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const togglePermission = (roleName: string, permKey: string) => {
    setRoles(prev => prev.map(r => {
      if (r.role !== roleName) return r;
      // Super admin always retains core permissions
      if (r.role === 'super_admin' && (permKey === 'role.manage' || permKey === 'system.manage')) {
        return r;
      }
      const hasPerm = r.permissions.includes(permKey);
      const nextPerms = hasPerm 
        ? r.permissions.filter(p => p !== permKey)
        : [...r.permissions, permKey];

      onLogAudit?.('Thay đổi phân quyền Role', `${r.title}: ${hasPerm ? 'Thu hồi' : 'Cấp quyền'} ${permKey}`);
      return { ...r, permissions: nextPerms };
    }));

    showToast(`Đã cập nhật quyền hạn cho vai trò thành công!`);
  };

  // Tính số trang đang trong chế độ bảo trì
  const maintenanceCount = Object.values(maintenanceSettings).filter(Boolean).length;
  const totalPages = Object.keys(maintenanceSettings).length;

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto overflow-y-auto font-sans select-none">
      {/* Toast Notification (macOS Pill) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1D1F]/90 backdrop-blur-xl text-white px-5 py-3 rounded-full shadow-[0_16px_36px_rgba(0,0,0,0.25)] flex items-center space-x-2.5 border border-white/10 animate-in fade-in text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Bảng Điều Khiển Quản Trị Viên (Super Admin)</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1D1D1F]">
          Phân Quyền & Quản Lý Bảo Trì Hệ Thống
        </h1>
        <p className="text-sm text-[#86868B] font-normal max-w-3xl">
          Toàn quyền kiểm soát giới hạn truy cập RBAC và kích hoạt/gỡ lệnh bảo trì độc lập cho từng trang và tính năng trên toàn bộ nền tảng SQLFlow.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: TRUNG TÂM ĐIỀU KHIỂN BẢO TRÌ TỪNG TRANG & TÍNH NĂNG (MỚI) */}
      {/* ========================================================================= */}
      <div className="apple-card bg-white rounded-3xl p-6 md:p-8 border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
        
        {/* Title bar with Summary Badge and Bulk Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-black/[0.06]">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center border border-amber-500/25">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
                  Công Tắc Bảo Trì Theo Từng Trang (Page-Level Maintenance Switch)
                </h3>
                <p className="text-xs text-[#86868B]">
                  Admin có thể chọn mở hoặc khóa bảo trì riêng lẻ cho từng trang. Người dùng chỉ được view trang khi bảo trì đang bật.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Status Pill */}
            <div className="px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center space-x-2 bg-slate-50 text-slate-700 border-slate-200">
              <span className={`w-2 h-2 rounded-full ${maintenanceCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>
                {maintenanceCount}/{totalPages} trang đang bảo trì
              </span>
            </div>

            {/* Quick Bulk Action: Mở hoạt động tất cả */}
            <button
              onClick={() => {
                onSetAllMaintenance?.(false);
                showToast('Đã gỡ bỏ toàn bộ lệnh bảo trì! Tất cả các trang đang hoạt động bình thường.');
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition active:scale-95 cursor-pointer shadow-2xs flex items-center space-x-1.5"
              title="Mở tất cả các trang cho học viên thao tác đầy đủ"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mở hoạt động tất cả</span>
            </button>

            {/* Quick Bulk Action: Bảo trì tất cả */}
            <button
              onClick={() => {
                onSetAllMaintenance?.(true);
                showToast('Đã kích hoạt bảo trì toàn diện! Tất cả các trang rơi vào chế độ xem trước (View-only).');
              }}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition active:scale-95 cursor-pointer shadow-2xs flex items-center space-x-1.5"
              title="Khóa toàn bộ hệ thống vào chế độ xem trước"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              <span>Bảo trì tất cả</span>
            </button>
          </div>
        </div>

        {/* 6 Pages Grid Switches */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MAINTENANCE_PAGES_META.map((meta) => {
            const isMaint = Boolean(maintenanceSettings[meta.id]);
            const Icon = iconMap[meta.iconName] || BookOpen;

            return (
              <div 
                key={meta.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isMaint 
                    ? 'bg-amber-50/40 border-amber-300/80 shadow-xs' 
                    : 'bg-white border-black/[0.08] hover:border-black/[0.15] shadow-2xs'
                }`}
              >
                {/* Top: Icon, Title & Category */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isMaint 
                          ? 'bg-amber-500/20 text-amber-700' 
                          : 'bg-[#0071E3]/10 text-[#0071E3]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1D1D1F] tracking-tight leading-snug">
                          {meta.name}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                          {meta.category}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {meta.route}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                    {meta.description}
                  </p>
                </div>

                {/* Bottom: Status & Toggle Switch */}
                <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between">
                  <div>
                    {isMaint ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <Wrench className="w-3 h-3 text-amber-700" />
                        <span>Đang Bảo Trì (View-Only)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Đang Hoạt Động (Online)</span>
                      </span>
                    )}
                  </div>

                  {/* Apple Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => {
                      onTogglePageMaintenance?.(meta.id);
                      showToast(
                        !isMaint 
                          ? `Đã kích hoạt bảo trì cho ${meta.name} (${meta.route})`
                          : `Đã mở hoạt động bình thường cho ${meta.name} (${meta.route})`
                      );
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isMaint ? 'bg-amber-500' : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    title={isMaint ? 'Nhấn để TẮT bảo trì (Mở hoạt động bình thường)' : 'Nhấn để BẬT bảo trì (Khóa vào chế độ chỉ xem)'}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isMaint ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helpful note for Admin */}
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Cơ chế tự động:</strong> Khi bạn gạt công tắc, trạng thái bảo trì sẽ được cập nhật ngay lập tức cho toàn bộ giao diện và được lưu vào bộ nhớ trình duyệt (localStorage). Ví dụ: Khi gạt tắt bảo trì <code>#curriculum</code>, người dùng truy cập trang lộ trình sẽ không bị bật popup bảo trì nữa.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: VAI TRÒ & MA TRẬN PHÂN QUYỀN RBAC (GIỮ NGUYÊN HOÀN CHỈNH) */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
            Cấu Hình Vai Trò & Ma Trận Phân Quyền RBAC
          </h2>
          <p className="text-xs text-[#86868B]">
            Thiết lập danh mục quyền hạn theo tài khoản người dùng trong hệ thống SQLFlow.
          </p>
        </div>

        {/* Roles Cards Grid - Apple Squircles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {roles.map((r) => (
            <div key={r.role} className="apple-card bg-white rounded-3xl p-6 border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1D1D1F] tracking-tight">{r.title}</span>
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: r.color }} />
              </div>
              <p className="text-xs text-[#86868B] leading-relaxed">{r.description}</p>
              <div className="pt-2 text-xs font-semibold text-[#0071E3]">
                {r.permissions.length} quyền được cấp
              </div>
            </div>
          ))}
        </div>

        {/* Permission Matrix Table - Apple Numbers Data Grid */}
        <div className="apple-card bg-white rounded-3xl border border-black/[0.06] shadow-[0_2px_14px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-[#1D1D1F] text-sm tracking-tight">Ma trận Phân quyền Hệ thống</h3>
            </div>
            <span className="text-xs text-[#86868B]">Click vào ô để bật / tắt quyền hạn tức thì</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F5F7]/80 border-b border-black/[0.06] text-[#86868B] font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5 w-1/3">Quyền hạn (Permissions)</th>
                  {roles.map(r => (
                    <th key={r.role} className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-[#1D1D1F]">{r.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {allPermissionDefinitions.map((perm) => (
                  <tr key={perm.key} className="hover:bg-black/[0.015] transition">
                    <td className="py-3.5 px-5">
                      <span className="font-mono text-[#0071E3] font-semibold block text-[11px]">{perm.key}</span>
                      <span className="text-[#86868B] text-[11px]">{perm.label}</span>
                    </td>

                    {roles.map((r) => {
                      const hasPerm = r.permissions.includes(perm.key);
                      const isImmutable = r.role === 'super_admin' && (perm.key === 'role.manage' || perm.key === 'system.manage');

                      return (
                        <td key={r.role} className="py-3.5 px-4 text-center">
                          <button
                            disabled={isImmutable}
                            onClick={() => togglePermission(r.role, perm.key)}
                            className={`w-7 h-7 rounded-full inline-flex items-center justify-center transition active:scale-90 ${
                              hasPerm
                                ? 'bg-emerald-500/15 text-emerald-600 shadow-sm border border-emerald-500/20'
                                : 'bg-black/[0.04] text-[#86868B] hover:bg-black/[0.08]'
                            } ${isImmutable ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                            title={isImmutable ? 'Quyền cốt lõi bắt buộc của Super Admin' : hasPerm ? 'Nhấn để thu hồi quyền' : 'Nhấn để cấp quyền'}
                          >
                            {hasPerm ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <X className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RolesManagementView = React.memo(RolesManagementViewComponent);
