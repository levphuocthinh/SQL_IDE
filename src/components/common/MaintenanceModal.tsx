import React from 'react';
import { ModalPortal } from './ModalPortal';
import { Play, X, ArrowRight, ShieldAlert, Sparkles, Wrench } from 'lucide-react';

export interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  featureName?: string;
  description?: string;
  onSwitchToPlayground?: () => void;
  actionText?: string;
}

/**
 * Component Modal thông báo Bảo Trì / Nâng Cấp hệ thống
 * Thiết kế phong cách Apple cao cấp, tích hợp hình ảnh nhân vật cúi đầu xin lỗi (Bowing Character)
 * Được thiết kế linh hoạt, tái sử dụng (kế thừa) cho bất kỳ tính năng nào cần bảo trì trong tương lai.
 */
export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  title = 'Tính Năng Đang Trong Quá Trình Bảo Trì & Nâng Cấp',
  featureName,
  description,
  onSwitchToPlayground,
  actionText = 'Trải Nghiệm SQL Playground (Tự Do)',
}) => {
  if (!isOpen) return null;

  return (
    <ModalPortal>
      {/* Backdrop mờ tối sang trọng */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200 flex items-center justify-center p-4 sm:p-6 z-[100000]"
        onClick={onClose}
      >
        {/* Hộp thoại chính */}
        <div 
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200 relative select-none font-sans"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút đóng nhanh ở góc trên bên phải */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dải gradient màu ấm báo hiệu bảo trì */}
          <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

          <div className="p-6 sm:p-8 text-center space-y-5">
            {/* Hình ảnh nhân vật cúi đầu xin lỗi (Dogeza Bowing Character) */}
            <div className="relative inline-block">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200/90 flex items-center justify-center p-2 shadow-inner group">
                <img 
                  src="/images/maintenance-bow.png" 
                  alt="Hệ thống đang bảo trì" 
                  className="w-20 h-20 object-contain drop-shadow-sm hover:scale-105 transition-transform"
                />
              </div>
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-xs flex items-center space-x-1 border border-white">
                <Wrench className="w-2.5 h-2.5" />
                <span>Bảo trì</span>
              </span>
            </div>

            {/* Tiêu đề & Nhãn thông báo */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>CHẾ ĐỘ XEM TRƯỚC (DEMO MODE)</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug pt-1">
                {title}
              </h3>

              {featureName && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg py-1 px-3 inline-block">
                  Chức năng: <span className="underline">{featureName}</span> tạm thời bị khóa
                </p>
              )}
            </div>

            {/* Nội dung giải thích thân thiện */}
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed text-left bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-2">
              <p>
                {description || (
                  <>
                    Hệ thống đang được <strong>bảo trì và nâng cấp</strong> để mang lại trải nghiệm tốt hơn cho bạn. Tính năng này sẽ sớm hoạt động trở lại.
                  </>
                )}
              </p>
              <p className="text-slate-500 text-xs">
                Hiện tại bạn đang ở <strong>Chế độ Xem Demo (Read-Only)</strong>. Bạn có thể thoải mái tham quan giao diện bài học và lộ trình. Để gõ và chạy câu lệnh SQL tự do, bạn vui lòng chuyển sang <strong>SQL Playground</strong>.
              </p>
              <p className="text-amber-700 font-semibold text-xs italic">
                Thành thật xin lỗi bạn vì sự bất tiện này!
              </p>
            </div>

            {/* Các nút hành động */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              {onSwitchToPlayground ? (
                <button
                  onClick={() => {
                    onClose();
                    onSwitchToPlayground();
                  }}
                  className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:opacity-95 text-white font-bold text-sm transition-all shadow-md shadow-[#0284C7]/25 flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{actionText}</span>
                </button>
              ) : null}

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition cursor-pointer active:scale-[0.98]"
              >
                Tiếp Tục Xem Demo
              </button>
            </div>

          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
