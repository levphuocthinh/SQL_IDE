import { StudentManagementItem } from '../types/platform';
import { defaultStudents } from '../mock/platformData';

/**
 * ============================================================================
 * CLASS: StudentService (OOP Service)
 * ============================================================================
 * Lớp đối tượng chịu trách nhiệm quản lý toàn bộ học viên trong khu vực Quản trị:
 * - Khóa / Mở khóa tài khoản học viên.
 * - Gửi yêu cầu đặt lại mật khẩu.
 * - Thêm ghi chú hỗ trợ học viên từ đội ngũ Quản trị / Giảng viên.
 */
export class StudentService {
  private students: StudentManagementItem[];

  constructor(initialStudents: StudentManagementItem[] = defaultStudents) {
    this.students = [...initialStudents];
  }

  /**
   * Lấy danh sách toàn bộ học viên
   */
  public getStudents(): StudentManagementItem[] {
    return [...this.students];
  }

  /**
   * Tìm kiếm học viên theo ID
   */
  public findById(id: string): StudentManagementItem | undefined {
    return this.students.find(s => s.id === id);
  }

  /**
   * Bật / Tắt trạng thái khóa tài khoản học viên
   */
  public toggleBlock(studentId: string): { student: StudentManagementItem | null; nextStatus: 'active' | 'blocked' } {
    let nextStatus: 'active' | 'blocked' = 'active';
    let targetStudent: StudentManagementItem | null = null;

    this.students = this.students.map(s => {
      if (s.id === studentId) {
        nextStatus = s.status === 'blocked' ? 'active' : 'blocked';
        targetStudent = { ...s, status: nextStatus };
        return targetStudent;
      }
      return s;
    });

    return { student: targetStudent, nextStatus };
  }

  /**
   * Thêm ghi chú hỗ trợ học viên
   */
  public addSupportNote(studentId: string, author: string, content: string): StudentManagementItem | null {
    const newNote = {
      id: `sn-${Date.now()}`,
      author,
      date: new Date().toLocaleDateString('vi-VN'),
      content,
    };

    let updatedStudent: StudentManagementItem | null = null;

    this.students = this.students.map(s => {
      if (s.id === studentId) {
        updatedStudent = {
          ...s,
          supportNotes: [newNote, ...s.supportNotes],
        };
        return updatedStudent;
      }
      return s;
    });

    return updatedStudent;
  }
}
