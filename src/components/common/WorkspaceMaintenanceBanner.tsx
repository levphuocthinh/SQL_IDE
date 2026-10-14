import React from 'react';

interface WorkspaceMaintenanceBannerProps {
  /** Có hiển thị banner hay không */
  isVisible: boolean;
  /** Hàm gọi khi bấm xem chi tiết bảo trì */
  onOpenMaintenanceModal: () => void;
  /** Hàm gọi khi bấm chuyển sang SQL Playground tự do */
  onSwitchToPlayground: () => void;
}

/**
 * ============================================================================
 * COMPONENT: WorkspaceMaintenanceBanner
 * ============================================================================
 * Dải banner cảnh báo Chế độ Xem Demo (Read-Only) gắn cố định ở đỉnh Workspace.
 * - Thông báo cho người dùng biết Không gian học đang ở chế độ xem trước vì hệ thống đang bảo trì nâng cấp.
 * - Nút xem chi tiết bảo trì (mở MaintenanceModal có hình chú bé cúi đầu).
 * - Nút chuyển nhanh sang SQL Playground tự do để viết truy vấn 4 bảng Tiếng Việt.
 */
export const WorkspaceMaintenanceBanner: React.FC<WorkspaceMaintenanceBannerProps> = ({
  isVisible,
  onOpenMaintenanceModal,
  onSwitchToPlayground,
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-b border-amber-300/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900 sticky top-0 z-20 backdrop-blur-md shadow-2xs font-sans select-none">
      <div className="flex items-center space-x-2.5">
        <img 
          src="/images/maintenance-bow.png" 
          alt="Bảo trì hệ thống" 
          className="w-5 h-5 object-contain" 
        />
        <span>
          <strong>Chế Độ Xem Demo (Chỉ Đọc)</strong>: Toàn bộ lộ trình và giao diện mở để tham quan. Trình soạn thảo và tính năng chấm điểm tạm khóa để bảo trì nâng cấp hệ thống.
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenMaintenanceModal}
          className="px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-xs transition active:scale-95 cursor-pointer"
        >
          Chi tiết bảo trì
        </button>

        <button
          onClick={onSwitchToPlayground}
          className="px-3 py-1 rounded-full bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 font-semibold text-[11px] shadow-xs transition active:scale-95 cursor-pointer"
        >
          Mở SQL Playground (Tự do)
        </button>
      </div>
    </div>
  );
};
