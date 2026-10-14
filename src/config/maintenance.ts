/**
 * ============================================================================
 * CẤU HÌNH TRẠNG THÁI BẢO TRÌ HỆ THỐNG THEO TỪNG TRANG & TÍNH NĂNG
 * (GRANULAR PAGE-LEVEL MAINTENANCE CONTROLLER)
 * ============================================================================
 * 
 * Cho phép Quản trị viên (Super Admin) toàn quyền quyết định:
 * - Kích hoạt bảo trì cho trang/tính năng nào (View-only hoặc chặn thao tác sâu).
 * - Mở hoạt động bình thường (gỡ lệnh bảo trì) cho trang/tính năng nào.
 * - Lưu trữ cấu hình bền vững vào localStorage để bảo toàn khi F5 hoặc chuyển qua lại giữa các vai trò.
 */

export interface MaintenanceSettings {
  curriculum: boolean;      // Lộ trình học tập (#curriculum)
  courses: boolean;         // Khóa học SQL (#workspace/courses)
  practice: boolean;        // Luyện tập & Chấm điểm (#workspace/practice)
  projects: boolean;        // Dự án của tôi (#workspace/projects)
  workspace: boolean;       // Tổng quan không gian học (#workspace/overview)
  sqlPlayground: boolean;   // SQL Playground tự do (#sql)
}

export interface MaintenancePageMeta {
  id: keyof MaintenanceSettings;
  name: string;
  route: string;
  category: 'Landing Page' | 'Không Gian Học Tập' | 'SQL Sandbox';
  description: string;
  iconName: string;
}

export const defaultMaintenanceSettings: MaintenanceSettings = {
  curriculum: true,    // Mặc định: Lộ trình học tập bảo trì (View-only)
  courses: true,       // Mặc định: Khóa học bảo trì
  practice: true,      // Mặc định: Chấm điểm bài tập bảo trì
  projects: true,      // Mặc định: Dự án cá nhân bảo trì
  workspace: true,     // Mặc định: Không gian học tập bảo trì (Chế độ xem demo)
  sqlPlayground: false // Mặc định: SQL Playground mở tự do cho mọi người vọc
};

export const MAINTENANCE_PAGES_META: MaintenancePageMeta[] = [
  {
    id: 'curriculum',
    name: 'Lộ trình học tập',
    route: '#curriculum',
    category: 'Landing Page',
    description: 'Trang lộ trình đào tạo từ cơ bản đến nâng cao trên Trang chủ (Tự động bật Pop-up bảo trì khi người dùng truy cập).',
    iconName: 'BookOpen',
  },
  {
    id: 'courses',
    name: 'Khóa học SQL',
    route: '#workspace/courses',
    category: 'Không Gian Học Tập',
    description: 'Danh mục khóa học & Lộ trình chi tiết (Chặn mở chi tiết bài giảng và syllabus khi bảo trì).',
    iconName: 'GraduationCap',
  },
  {
    id: 'practice',
    name: 'Luyện tập & Chấm điểm',
    route: '#workspace/practice',
    category: 'Không Gian Học Tập',
    description: 'Trình soạn thảo SQL, bài tập thực hành và bộ máy tự động chấm điểm bài nộp.',
    iconName: 'Code2',
  },
  {
    id: 'projects',
    name: 'Dự án cá nhân',
    route: '#workspace/projects',
    category: 'Không Gian Học Tập',
    description: 'Không gian tạo mới, chỉnh sửa, xóa và lưu trữ câu lệnh truy vấn dự án của học viên.',
    iconName: 'FolderGit2',
  },
  {
    id: 'workspace',
    name: 'Không gian học (Tổng quan)',
    route: '#workspace/overview',
    category: 'Không Gian Học Tập',
    description: 'Bảng điều khiển học tập, chuỗi học tập streak và thông báo Chế độ xem trước (Read-Only).',
    iconName: 'Compass',
  },
  {
    id: 'sqlPlayground',
    name: 'SQL Playground (Tự do)',
    route: '#sql',
    category: 'SQL Sandbox',
    description: 'Môi trường thực thi SQL độc lập với cơ sở dữ liệu Công ty 4 bảng (PHONGBAN, NHANVIEN, DUAN, PHANCONG).',
    iconName: 'Database',
  },
];

const STORAGE_KEY = 'sqlflow_maintenance_settings';

/**
 * Đọc cấu hình bảo trì từ localStorage hoặc trả về giá trị mặc định
 */
export const loadMaintenanceSettings = (): MaintenanceSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultMaintenanceSettings, ...parsed };
    }
  } catch (error) {
    console.error('Lỗi khi đọc cấu hình bảo trì từ localStorage:', error);
  }
  return defaultMaintenanceSettings;
};

/**
 * Lưu cấu hình bảo trì mới vào localStorage
 */
export const saveMaintenanceSettings = (settings: MaintenanceSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Lỗi khi lưu cấu hình bảo trì vào localStorage:', error);
  }
};

/**
 * Biến tương thích ngược (Legacy flag)
 */
export const IS_LEARN_SYSTEM_MAINTENANCE: boolean = true;
