import React, { useState } from 'react';
import { UserProfile } from '../../types/platform';
import { defaultAdmin, defaultLearner } from '../../mock/platformData';
import { 
  Database,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
  X,
  Lock
} from 'lucide-react';

interface AuthModalProps {
  onLogin: (user: UserProfile) => void;
  onClose?: () => void;
  requiredRole?: 'super_admin' | 'learner';
  customTitle?: string;
  customDescription?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  onLogin, 
  onClose,
  requiredRole,
  customTitle,
  customDescription
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const isAdminRequired = requiredRole === 'super_admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. KỊCH BẢN YÊU CẦU QUYỀN QUẢN TRỊ VIÊN (Super Admin)
    if (isAdminRequired) {
      const isValidAdminEmail = 
        cleanEmail === 'admin@sqlflow.edu.vn' || 
        cleanEmail === 'admin@sqlflow.com' || 
        cleanEmail === 'admin' ||
        cleanEmail.includes('admin');
      
      const isValidAdminPass = cleanPassword === 'admin' || cleanPassword === 'admin123';

      if (!isValidAdminEmail) {
        setErrorMessage('Tài khoản này không có quyền Quản trị viên (Super Admin)! Vui lòng dùng: admin@sqlflow.edu.vn');
        return;
      }

      if (!isValidAdminPass) {
        setErrorMessage('Mật khẩu Quản trị viên không chính xác! (Mật khẩu mặc định: admin)');
        return;
      }

      onLogin(defaultAdmin);
      return;
    }

    // 2. KỊCH BẢN ĐĂNG NHẬP THÔNG THƯỜNG
    if (cleanEmail.includes('admin')) {
      if (cleanPassword === 'admin' || cleanPassword === 'admin123') {
        onLogin(defaultAdmin);
      } else {
        setErrorMessage('Mật khẩu tài khoản Quản trị viên không chính xác (Mật khẩu mặc định: admin).');
      }
    } else {
      onLogin(defaultLearner);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ Email.');
      return;
    }
    setForgotSent(true);
  };

  return (
    <div className="fixed inset-0 z-[100001] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none font-sans animate-in fade-in duration-200">
      {/* Background ambient lighting */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${isAdminRequired ? 'bg-[#7C3AED]/25' : 'bg-[#0071E3]/20'} rounded-full blur-3xl pointer-events-none`} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="apple-card bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-8 shadow-[0_24px_70px_rgba(0,0,0,0.25)] border border-black/[0.08] relative z-10 space-y-6">
        {/* Close Button if opened as modal */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            title="Đóng hộp thoại"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className={`w-12 h-12 rounded-2xl ${isAdminRequired ? 'bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] shadow-[#7C3AED]/30' : 'bg-gradient-to-tr from-[#0071E3] to-[#47A4FF] shadow-[#0071E3]/25'} flex items-center justify-center shadow-md`}>
            {isAdminRequired ? (
              <ShieldCheck className="w-6 h-6 text-white" />
            ) : (
              <Database className="w-6 h-6 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
            {customTitle || (isAdminRequired ? 'Xác Thực Quản Trị Viên' : 'SQLFlow ID')}
          </h1>
          <p className="text-xs text-[#86868B] font-normal max-w-xs">
            {customDescription || (isAdminRequired 
              ? 'Khu vực quản trị chỉ dành riêng cho Super Admin. Vui lòng đăng nhập đúng tài khoản Quản trị viên để tiếp tục.' 
              : 'Learn by doing · Nền tảng học & luyện tập SQL tiêu chuẩn quốc tế')}
          </p>
        </div>

        {/* Quick Demo One-Click Login Buttons - CHỈ HIỂN THỊ CHO HỌC VIÊN, KHÔNG CHO BỎ QUA ADMIN */}
        {!isAdminRequired && (
          <>
            <div className="space-y-2.5 p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04]">
              <span className="text-[10px] font-semibold text-[#86868B] block uppercase tracking-wider text-center">
                Trải nghiệm nhanh (1-Click Demo):
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => onLogin(defaultLearner)}
                  className="py-2.5 px-3 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition active:scale-[0.98] cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Vào Chế Độ Học Viên Demo</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center space-x-3">
              <div className="h-px bg-black/[0.06] flex-1" />
              <span className="text-[10px] font-semibold text-[#86868B] uppercase tracking-wider">
                hoặc đăng nhập tài khoản
              </span>
              <div className="h-px bg-black/[0.06] flex-1" />
            </div>
          </>
        )}

        {/* Thẻ gợi ý tài khoản Admin khi ở chế độ yêu cầu Admin */}
        {isAdminRequired && (
          <div className="p-3.5 rounded-2xl bg-purple-50/90 border border-purple-200/80 text-purple-900 text-xs flex items-start space-x-2.5">
            <Lock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-950 mb-0.5">Tài khoản Quản trị viên:</p>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                Email: <span className="font-mono font-bold bg-purple-200/70 px-1 py-0.5 rounded text-purple-900">admin@sqlflow.edu.vn</span>
                <br />
                Mật khẩu: <span className="font-mono font-bold bg-purple-200/70 px-1 py-0.5 rounded text-purple-900">admin</span>
              </p>
            </div>
          </div>
        )}

        {/* Mode: Forgot Password */}
        {mode === 'forgot' ? (
          forgotSent ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-[#1D1D1F] text-sm">Đã gửi liên kết khôi phục</h3>
              <p className="text-xs text-[#86868B]">
                Vui lòng kiểm tra email <strong className="text-[#1D1D1F]">{email}</strong> để đặt lại mật khẩu.
              </p>
              <button
                onClick={() => { setMode('login'); setForgotSent(false); }}
                className="mt-3 text-xs font-semibold text-[#0071E3] hover:underline"
              >
                Quay lại Đăng nhập
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-[#86868B]">
                Nhập địa chỉ email tài khoản của bạn để nhận liên kết đặt lại mật khẩu:
              </p>
              <div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#1D1D1F] text-white font-semibold text-xs hover:bg-black transition active:scale-[0.98]"
              >
                Gửi liên kết khôi phục
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-[#86868B] hover:text-[#1D1D1F] font-semibold"
                >
                  Quay lại đăng nhập
                </button>
              </div>
            </form>
          )
        ) : (
          /* Mode: Login / Register */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1D1D1F]">
                {isAdminRequired ? 'Email Quản trị viên' : 'Email tài khoản'}
              </label>
              <input
                type={cleanEmailType(isAdminRequired)}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminRequired ? 'admin@sqlflow.edu.vn' : 'thinh@example.com'}
                className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#1D1D1F]">Mật khẩu</label>
                {!isAdminRequired && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-[#0071E3] hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3.5 rounded-2xl border border-black/[0.08] bg-[#F5F5F7] hover:bg-black/[0.04] focus:bg-white text-[#1D1D1F] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 font-medium transition"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-full ${
                isAdminRequired 
                  ? 'bg-[#7C3AED] hover:bg-[#6D28D9]' 
                  : 'bg-[#0071E3] hover:bg-[#0077ED]'
              } text-white font-semibold text-xs transition shadow-sm active:scale-[0.98] cursor-pointer`}
            >
              {isAdminRequired 
                ? 'Đăng nhập Quản Trị Viên' 
                : (mode === 'login' ? 'Đăng nhập ngay' : 'Đăng ký tài khoản mới')}
            </button>

            {!isAdminRequired && (
              <div className="text-center pt-2">
                <span className="text-xs text-[#86868B]">
                  {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                </span>
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-xs font-semibold text-[#0071E3] hover:underline"
                >
                  {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

// Hỗ trợ nhập 'admin' không cần định dạng @
function cleanEmailType(isAdmin: boolean): string {
  return isAdmin ? 'text' : 'email';
}
