import React from 'react';
import { ModalPortal } from './ModalPortal';
import { 
  GraduationCap, 
  Play, 
  Sparkles, 
  X, 
  Server, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Database,
  ArrowRight,
  Code2
} from 'lucide-react';

interface PendingFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreSql: () => void;
  onOpenDemoAuth?: () => void;
}

/**
 * Modal thông báo tính năng "Học SQL" đang bảo trì nâng cấp hệ thống
 * Thiết kế phong cách Apple Glass cao cấp, thân thiện và hướng dẫn người dùng
 * trải nghiệm ngay trình soạn thảo SQL Playground không cần tài khoản.
 */
export const PendingFeatureModal: React.FC<PendingFeatureModalProps> = ({
  isOpen,
  onClose,
  onExploreSql,
  onOpenDemoAuth,
}) => {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      {/* Backdrop mờ phong cách Apple */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200 flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
      >
        {/* Hộp thoại chính */}
        <div 
          className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200 relative select-none font-sans"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút đóng nhanh ở góc trên bên phải */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            title="Đóng hộp thoại"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dải màu trang trí phía trên */}
          <div className="h-2 w-full bg-gradient-to-r from-[#0284C7] via-[#38BDF8] to-[#818CF8]" />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header: Biểu tượng & Tiêu đề */}
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center shadow-lg shadow-[#0284C7]/25 shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>Đang Bảo Trì Nâng Cấp</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    Sắp ra mắt
                  </span>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  Tính Năng Học SQL Bài Bản
                </h3>
              </div>
            </div>

            {/* Nội dung giải thích thân thiện */}
            <p className="text-sm text-slate-600 leading-relaxed">
              Tính năng lưu bài học, quản lý tài khoản và chấm điểm tự động đang được <strong>bảo trì nâng cấp hệ thống</strong>. Tính năng sẽ sớm hoạt động trở lại, bạn vui lòng quay lại sau nhé!
            </p>

            {/* Khối gợi ý trải nghiệm hiện tại */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-slate-50 border border-blue-100 p-4 sm:p-5 space-y-3">
              <div className="flex items-center space-x-2 text-[#0284C7] font-bold text-xs uppercase tracking-wider">
                <Play className="w-3.5 h-3.5 fill-[#0284C7]" />
                <span>Trải Nghiệm Toàn Diện Ngay Hôm Nay</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>SQL Playground tốc độ cao:</strong> Gõ và thực thi các lệnh <code className="text-[#0284C7] font-mono font-bold">SELECT</code>, <code className="text-[#0284C7] font-mono font-bold">INSERT</code>, <code className="text-[#0284C7] font-mono font-bold">JOIN</code> tức thì trên trình duyệt.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>CSDL Công Ty 4 bảng (DB CTY):</strong> Cấu trúc sẵn sàng gồm Phòng ban, Nhân viên, Dự án và Phân công.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Sơ đồ quan hệ ERD 120 FPS:</strong> Trực quan hóa khóa chính (PK) và khóa ngoại (FK) mượt mà.</span>
                </li>
              </ul>
            </div>

            {/* Các nút hành động chính */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onExploreSql();
                }}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:opacity-95 text-white font-bold text-sm transition-all shadow-md shadow-[#0284C7]/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Trải Nghiệm SQL Playground Ngay</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition cursor-pointer active:scale-[0.98]"
              >
                Đóng
              </button>
            </div>

            {/* Dòng link kín đáo cho Developer muốn xem trước giao diện Demo */}
            {onOpenDemoAuth && (
              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  onClick={() => {
                    onClose();
                    onOpenDemoAuth();
                  }}
                  className="text-[11px] text-slate-600 hover:text-[#0284C7] transition underline underline-offset-2 cursor-pointer font-medium"
                >
                  Dành cho Nhà phát triển: Xem trước giao diện Workspace (Demo)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
