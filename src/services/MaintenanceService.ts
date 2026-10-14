import { 
  MaintenanceSettings, 
  defaultMaintenanceSettings,
  MAINTENANCE_PAGES_META,
  MaintenancePageMeta 
} from '../config/maintenance';

const STORAGE_KEY = 'sqlflow_maintenance_settings';

/**
 * ============================================================================
 * CLASS: MaintenanceService (OOP Service)
 * ============================================================================
 * Lớp đối tượng chịu trách nhiệm quản lý cấu hình và trạng thái bảo trì hệ thống:
 * - Đọc và ghi đồng bộ với localStorage.
 * - Cung cấp các phương thức bật/tắt bảo trì theo từng trang hoặc toàn bộ hệ thống.
 * - Kiểm tra trạng thái bảo trì của một route/trang cụ thể.
 */
export class MaintenanceService {
  private settings: MaintenanceSettings;

  constructor() {
    this.settings = this.loadFromStorage();
  }

  /**
   * Đọc cấu hình từ localStorage
   */
  private loadFromStorage(): MaintenanceSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...defaultMaintenanceSettings, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.error('Không thể đọc cấu hình bảo trì từ storage:', e);
    }
    return { ...defaultMaintenanceSettings };
  }

  /**
   * Lưu cấu hình hiện tại vào localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.error('Không thể lưu cấu hình bảo trì vào storage:', e);
    }
  }

  /**
   * Lấy cấu hình bảo trì hiện tại
   */
  public getSettings(): MaintenanceSettings {
    return { ...this.settings };
  }

  /**
   * Kiểm tra một trang cụ thể có đang trong chế độ bảo trì hay không
   */
  public isUnderMaintenance(pageId: keyof MaintenanceSettings): boolean {
    return Boolean(this.settings[pageId]);
  }

  /**
   * Bật hoặc tắt bảo trì cho một trang cụ thể
   */
  public togglePage(pageId: keyof MaintenanceSettings, enabled?: boolean): MaintenanceSettings {
    const nextVal = enabled !== undefined ? enabled : !this.settings[pageId];
    this.settings = {
      ...this.settings,
      [pageId]: nextVal,
    };
    this.saveToStorage();
    return { ...this.settings };
  }

  /**
   * Bật hoặc tắt bảo trì cho tất cả các trang
   */
  public setAll(enable: boolean): MaintenanceSettings {
    this.settings = {
      curriculum: enable,
      courses: enable,
      practice: enable,
      projects: enable,
      workspace: enable,
      sqlPlayground: enable,
    };
    this.saveToStorage();
    return { ...this.settings };
  }

  /**
   * Lấy thông tin metadata của các trang được bảo trì
   */
  public getPagesMeta(): MaintenancePageMeta[] {
    return [...MAINTENANCE_PAGES_META];
  }
}
