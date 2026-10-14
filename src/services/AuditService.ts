import { AuditLogItem } from '../types/platform';
import { defaultAuditLogs } from '../mock/platformData';

/**
 * ============================================================================
 * CLASS: AuditService (OOP Service)
 * ============================================================================
 * Lớp đối tượng chịu trách nhiệm quản lý toàn bộ vòng đời của Nhật ký kiểm toán (Audit Logs):
 * - Đóng gói dữ liệu nhật ký (Encapsulation).
 * - Cung cấp các phương thức ghi log, lấy danh sách log và lọc log theo tiêu chí.
 */
export class AuditService {
  private logs: AuditLogItem[];

  constructor(initialLogs: AuditLogItem[] = defaultAuditLogs) {
    this.logs = [...initialLogs];
  }

  /**
   * Lấy toàn bộ danh sách nhật ký kiểm toán
   */
  public getLogs(): AuditLogItem[] {
    return [...this.logs];
  }

  /**
   * Thêm một bản ghi nhật ký mới vào đầu danh sách
   */
  public addLog(
    action: string,
    target: string,
    actorName: string,
    actorRole: string,
    status: 'success' | 'warning' | 'danger' = 'success'
  ): AuditLogItem {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      actorName,
      actorRole: actorRole === 'learner' ? 'Learner' : 'Super Admin',
      action,
      target,
      ip: '14.232.180.92',
      status,
    };

    this.logs = [newLog, ...this.logs];
    return newLog;
  }

  /**
   * Lọc nhật ký theo trạng thái
   */
  public filterByStatus(status: 'success' | 'warning' | 'danger'): AuditLogItem[] {
    return this.logs.filter(log => log.status === status);
  }
}
