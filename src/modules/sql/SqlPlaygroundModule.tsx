import React, { useState, Suspense, lazy } from 'react';
import { UserProfile } from '../../types/platform';
import { SQLEngine } from '../../engine/sqlEngine';
import { SqlPlaygroundHeader } from '../../components/layout/SqlPlaygroundHeader';
import { SchemaModal } from '../../components/common/SchemaModal';
import { AuthModal } from '../../components/auth/AuthModal';
import { PendingFeatureModal } from '../../components/common/PendingFeatureModal';

// Nạp lười PracticeView để tối ưu hóa kích thước bundle
const PracticeView = lazy(() =>
  import('../../components/learner/PracticeView').then(m => ({ default: m.PracticeView }))
);

const ViewFallback: React.FC = () => (
  <div className="w-full h-full min-h-[450px] flex flex-col items-center justify-center p-8 text-slate-500 font-sans">
    <div className="w-9 h-9 rounded-full border-[2.5px] border-slate-200 border-t-[#0284C7] animate-spin mb-3 shadow-xs" />
    <span className="text-xs font-semibold text-slate-600 tracking-wide">
      Đang chuẩn bị môi trường SQL Playground...
    </span>
  </div>
);

interface SqlPlaygroundModuleProps {
  companyEngine: SQLEngine;
  onBackToLanding: () => void;
  onOpenWorkspaceDemo: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  onCompleteExercise?: () => void;
  initialLessonId?: string | null;
  initialSqlOverride?: string | null;
  onClearInitialSqlOverride?: () => void;
}

/**
 * ============================================================================
 * MODULE: SqlPlaygroundModule
 * ============================================================================
 * Đóng gói toàn bộ giao diện và chức năng của Trình soạn thảo SQL Playground độc lập:
 * - Header điều hướng riêng biệt với phím bấm quay về Landing hoặc Không Gian Học.
 * - Trình soạn thảo SQL tương tác với CSDL Công ty 4 bảng Tiếng Việt.
 * - Modal tra cứu Schema CSDL (ERD, cấu trúc bảng, khóa chính/ngoại, dữ liệu mẫu).
 * - Modal đăng nhập và thông báo tính năng nâng cao.
 */
export const SqlPlaygroundModule: React.FC<SqlPlaygroundModuleProps> = ({
  companyEngine,
  onBackToLanding,
  onOpenWorkspaceDemo,
  onAuthSuccess,
  onCompleteExercise,
  initialLessonId,
  initialSqlOverride,
  onClearInitialSqlOverride,
}) => {
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#F4F6F9] overflow-hidden select-none font-sans">
      {/* Thanh Header điều hướng chuyên dụng riêng cho SQL Playground */}
      <SqlPlaygroundHeader
        onBackToLanding={onBackToLanding}
        onOpenWorkspaceDemo={onOpenWorkspaceDemo}
      />

      {/* Khung soạn thảo SQL độc lập */}
      <main className="flex-1 overflow-y-auto bg-[#F4F6F9] scrollbar-thin">
        <Suspense fallback={<ViewFallback />}>
          <PracticeView
            isStandalone={true}
            onSaveToProject={() => setIsPendingModalOpen(true)}
            onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
            onCompleteExercise={onCompleteExercise}
            initialLessonId={initialLessonId}
            initialSqlOverride={initialSqlOverride}
            onClearInitialSqlOverride={onClearInitialSqlOverride}
          />
        </Suspense>
      </main>

      {/* Modal lược đồ CSDL Công ty 4 bảng Tiếng Việt (PHONGBAN, NHANVIEN, DUAN, PHANCONG) */}
      <SchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        tables={companyEngine.getTables()}
        relationships={companyEngine.getRelationships()}
      />

      {/* Modal Đăng nhập / Chuyển quyền */}
      {isAuthModalOpen && (
        <AuthModal
          onLogin={(user) => {
            setIsAuthModalOpen(false);
            onAuthSuccess(user);
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* Modal Thông báo tính năng dành cho học viên chính thức */}
      <PendingFeatureModal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        onExploreSql={() => setIsPendingModalOpen(false)}
        onOpenDemoAuth={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
};
