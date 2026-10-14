import React, { useMemo } from 'react';
import { UserProfile, CourseItem, ProjectItem, AppNavTab } from '../../types/platform';

// Subcomponents
import { ContinueLearningCard } from './overview/ContinueLearningCard';
import { StudyMetricsCard } from './overview/StudyMetricsCard';
import { MacFolderDeck, ProjectDeckItem } from './overview/MacFolderDeck';
import { CourseFanDeck } from './overview/CourseFanDeck';

interface OverviewViewProps {
  user: UserProfile;
  courses: CourseItem[];
  projects?: ProjectItem[];
  onStartLesson: () => void;
  onViewCourses: () => void;
  onSelectTab?: (tab: AppNavTab) => void;
  onSelectProject?: (project: ProjectItem) => void;
  isMaintenance?: boolean;
  onTriggerMaintenance?: (feature?: string, description?: string) => void;
}

// 7-day activity data for the Apple Fitness / Timeline bar
const STATIC_WEEK_DAYS = [
  { day: 'T2', active: true, value: 85, hours: '1.2h' },
  { day: 'T3', active: true, value: 65, hours: '0.8h' },
  { day: 'T4', active: true, value: 100, hours: '1.8h' },
  { day: 'T5', active: true, value: 70, hours: '0.9h' },
  { day: 'T6', active: true, value: 90, hours: '1.4h' },
  { day: 'T7', active: false, value: 20, hours: '0.2h' },
  { day: 'CN', active: false, value: 15, hours: '0.1h' },
];

/**
 * Màn hình Tổng quan Học viên (Overview View)
 * Đóng vai trò là Điều phối viên (Coordinator) tổng hợp thông tin:
 * - ContinueLearningCard: Bài học đang dang dở cùng code preview terminal
 * - StudyMetricsCard: Lưới ma trận 6 chỉ số học tập + Apple fitness 7 ngày
 * - MacFolderDeck: Bộ 3 thư mục dự án xếp tầng 3D macOS
 * - CourseFanDeck: Các khóa học xòe quạt tương tác
 */
export const OverviewViewComponent: React.FC<OverviewViewProps> = ({
  user,
  courses,
  projects = [],
  onStartLesson,
  onViewCourses,
  onSelectTab,
  isMaintenance = false,
  onTriggerMaintenance,
}) => {
  const currentCourse = courses[0] || null;
  const weekDays = STATIC_WEEK_DAYS;

  // 3 Project items for the macOS Folder Deck memoized to avoid re-allocation on re-renders
  const projectDeck: ProjectDeckItem[] = useMemo(() => [
    {
      id: 'proj-1',
      title: projects[0]?.title || 'Banking ACID Transfer',
      shortName: 'Banking',
      fileName: 'banking_transactions.sql',
      engine: 'PostgreSQL',
      badge: 'Dự án chính',
      queriesCount: projects[0]?.queryCount || 4,
      linesCount: 145,
      folderColor: 'from-[#60A5FA] via-[#38BDF8] to-[#0284C7]',
      tabColor: 'from-[#38BDF8] to-[#0284C7]',
      previewCode: [
        '-- Giao dịch chuyển tiền ngân hàng an toàn (ACID)',
        'BEGIN TRANSACTION;',
        "UPDATE accounts SET balance = balance - 1500 WHERE id = 'ACC_901';",
        "UPDATE accounts SET balance = balance + 1500 WHERE id = 'ACC_902';",
        "INSERT INTO audit_logs (src, dst, amount) VALUES ('ACC_901', 'ACC_902', 1500);",
        'COMMIT;'
      ],
    },
    {
      id: 'proj-2',
      title: projects[1]?.title || 'E-Commerce Warehouse Analytics',
      shortName: 'E-Commerce',
      fileName: 'ecommerce_bi.sql',
      engine: 'PostgreSQL',
      badge: 'Dữ liệu lớn',
      queriesCount: projects[1]?.queryCount || 6,
      linesCount: 210,
      folderColor: 'from-[#818CF8] via-[#6366F1] to-[#4338CA]',
      tabColor: 'from-[#6366F1] to-[#4338CA]',
      previewCode: [
        '-- Phân tích doanh thu & xếp hạng danh mục sản phẩm',
        'WITH ranked_sales AS (',
        '  SELECT category_id, SUM(total_price) as revenue,',
        '         DENSE_RANK() OVER (ORDER BY SUM(total_price) DESC) as rnk',
        '  FROM order_items GROUP BY category_id',
        ')',
        'SELECT * FROM ranked_sales WHERE rnk <= 5;'
      ],
    },
    {
      id: 'proj-3',
      title: projects[2]?.title || 'Hospital Patient Records System',
      shortName: 'Hospital',
      fileName: 'patient_diagnostics.sql',
      engine: 'MySQL',
      badge: 'Bảo mật cao',
      queriesCount: projects[2]?.queryCount || 3,
      linesCount: 95,
      folderColor: 'from-[#34D399] via-[#10B981] to-[#059669]',
      tabColor: 'from-[#10B981] to-[#059669]',
      previewCode: [
        '-- Hồ sơ điều trị bệnh nhân & lịch hẹn khám',
        'SELECT p.patient_id, p.full_name, d.diagnosis, a.appointment_date',
        'FROM patients p',
        'JOIN appointments a ON p.patient_id = a.patient_id',
        'JOIN diagnostics d ON a.id = d.appointment_id',
        "WHERE a.status = 'COMPLETED';",
      ],
    },
  ], [projects]);

  const handleOpenIdeFromFolder = () => {
    if (isMaintenance) {
      onTriggerMaintenance?.('Mở dự án trong không gian thực hành', 'Chức năng thực hành bài học đang tạm khóa để bảo trì nâng cấp hệ thống.');
      return;
    }
    if (onSelectTab) onSelectTab('practice');
    else onStartLesson();
  };

  const handleStartLessonSafe = () => {
    if (isMaintenance) {
      onTriggerMaintenance?.('Bài học thực hành SQL', 'Chức năng thực hành bài học đang tạm khóa để bảo trì nâng cấp hệ thống.');
      return;
    }
    onStartLesson();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto overflow-y-auto font-sans antialiased text-slate-800">
      
      {/* 1. Header Finder / Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-3 py-0.5 rounded-full border border-[#0071E3]/20">
              Không gian cá nhân
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Chào mừng trở lại, {user.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Tổng quan Lộ trình SQL
          </h1>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded-full">
            Phiên đăng nhập: <strong className="text-slate-900">Học viên (Learner)</strong>
          </span>
        </div>
      </div>

      {/* 2. 2-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch">
        
        {/* Left Column (7 cols): Continue Learning + Study Metrics */}
        <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-7">
          <ContinueLearningCard
            user={user}
            currentCourse={currentCourse}
            onStartLesson={handleStartLessonSafe}
          />

          <StudyMetricsCard
            user={user}
            weekDays={weekDays}
          />
        </div>

        {/* Right Column (5 cols): 3D Mac Folder Deck + Course Fan Deck */}
        <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-7">
          <MacFolderDeck
            projectDeck={projectDeck}
            onOpenIde={handleOpenIdeFromFolder}
          />

          <CourseFanDeck
            onViewCourses={onViewCourses}
            onStartLesson={handleStartLessonSafe}
          />
        </div>

      </div>
    </div>
  );
};

export const OverviewView = React.memo(OverviewViewComponent);
