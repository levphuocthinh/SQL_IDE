import React from 'react';
import { ArrowLeft, Database, GraduationCap } from 'lucide-react';

interface SqlPlaygroundHeaderProps {
  /** Hàm gọi khi bấm nút quay lại Trang chủ */
  onBackToLanding: () => void;
  /** Hàm gọi khi bấm nút Xem Demo Không Gian Học Tập */
  onOpenWorkspaceDemo: () => void;
}

/**
 * ============================================================================
 * COMPONENT: SqlPlaygroundHeader
 * ============================================================================
 * Thanh điều hướng chuyên dụng riêng cho chế độ SQL Playground độc lập.
 * - Nút quay lại Trang chủ (đồng bộ Browser History).
 * - Logo thương hiệu SQLFlow v2.0 và nhãn SQL IDE.
 * - Nút chuyển nhanh sang "Học SQL (Xem Demo)" dành cho người dùng muốn tham quan lộ trình.
 */
export const SqlPlaygroundHeader: React.FC<SqlPlaygroundHeaderProps> = ({
  onBackToLanding,
  onOpenWorkspaceDemo,
}) => {
  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 shadow-2xs select-none">
      {/* Khối bên trái: Nút quay lại trang chủ & Logo thương hiệu */}
      <div className="flex items-center space-x-3.5">
        <button
          onClick={onBackToLanding}
          className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
          title="Quay lại Trang chủ"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
          <span>Trang chủ</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-200" />

        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white shadow-xs">
            <Database className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-slate-900 text-sm tracking-tight">SQLFlow</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0284C7] border border-blue-200">
            SQL IDE
          </span>
        </div>
      </div>

      {/* Khối bên phải: Nút CTA mở Không Gian Học Tập (Xem Demo) */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenWorkspaceDemo}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white text-xs font-bold hover:shadow-md hover:shadow-[#0284C7]/20 transition active:scale-95 flex items-center space-x-1.5 cursor-pointer"
        >
          <GraduationCap className="w-3.5 h-3.5 text-white/95" />
          <span>Học SQL</span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">
            Xem Demo
          </span>
        </button>
      </div>
    </header>
  );
};
