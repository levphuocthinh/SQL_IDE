import { ProjectItem, ProjectQueryItem } from '../types/platform';
import { defaultProjects } from '../mock/platformData';

/**
 * ============================================================================
 * CLASS: ProjectService (OOP Service)
 * ============================================================================
 * Lớp đối tượng chịu trách nhiệm toàn bộ các nghiệp vụ liên quan đến Dự án cá nhân (Projects):
 * - Tạo mới, cập nhật, xóa, nhân bản dự án.
 * - Quản lý các file câu lệnh truy vấn SQL (Query Files) bên trong từng dự án.
 */
export class ProjectService {
  private projects: ProjectItem[];

  constructor(initialProjects: ProjectItem[] = defaultProjects) {
    this.projects = [...initialProjects];
  }

  /**
   * Lấy danh sách toàn bộ dự án
   */
  public getProjects(): ProjectItem[] {
    return [...this.projects];
  }

  /**
   * Tìm kiếm dự án theo ID
   */
  public findById(id: string): ProjectItem | undefined {
    return this.projects.find(p => p.id === id);
  }

  /**
   * Khởi tạo một dự án mới
   */
  public createProject(
    title: string, 
    description: string, 
    engine: 'PostgreSQL' | 'MySQL' | 'SQLite'
  ): ProjectItem {
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title,
      description,
      engine,
      queryCount: 0,
      notes: '',
      queries: [],
      updatedAt: 'Vừa xong',
    };

    this.projects = [newProject, ...this.projects];
    return newProject;
  }

  /**
   * Cập nhật thông tin dự án
   */
  public updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
    let updatedProj: ProjectItem | null = null;
    this.projects = this.projects.map(p => {
      if (p.id === id) {
        updatedProj = { ...p, ...updates, updatedAt: 'Vừa xong' };
        return updatedProj;
      }
      return p;
    });
    return updatedProj;
  }

  /**
   * Xóa một dự án
   */
  public deleteProject(id: string): boolean {
    const initialLength = this.projects.length;
    this.projects = this.projects.filter(p => p.id !== id);
    return this.projects.length < initialLength;
  }

  /**
   * Nhân bản (Duplicate) một dự án có sẵn
   */
  public duplicateProject(id: string): ProjectItem | null {
    const target = this.findById(id);
    if (!target) return null;

    const duplicated: ProjectItem = {
      ...target,
      id: `proj-${Date.now()}`,
      title: `${target.title} (Bản sao)`,
      updatedAt: 'Vừa xong',
      queries: target.queries.map(q => ({
        ...q,
        id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      })),
    };

    this.projects = [duplicated, ...this.projects];
    return duplicated;
  }

  /**
   * Lưu hoặc thêm một câu lệnh SQL mới vào dự án
   */
  public addQueryToProject(projectId: string, queryName: string, sql: string): ProjectQueryItem | null {
    const target = this.findById(projectId);
    if (!target) return null;

    const newQuery: ProjectQueryItem = {
      id: `q-${Date.now()}`,
      name: queryName,
      sql,
    };

    this.projects = this.projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          queryCount: p.queryCount + 1,
          queries: [...p.queries, newQuery],
          updatedAt: 'Vừa xong',
        };
      }
      return p;
    });

    return newQuery;
  }

  /**
   * Xóa một tệp câu lệnh SQL khỏi dự án
   */
  public deleteQueryFromProject(projectId: string, queryId: string): boolean {
    let success = false;
    this.projects = this.projects.map(p => {
      if (p.id === projectId) {
        const remaining = p.queries.filter(q => q.id !== queryId);
        success = remaining.length < p.queries.length;
        return {
          ...p,
          queryCount: remaining.length,
          queries: remaining,
          updatedAt: 'Vừa xong',
        };
      }
      return p;
    });
    return success;
  }

  /**
   * Cập nhật tệp câu lệnh SQL trong dự án
   */
  public updateQueryInProject(
    projectId: string, 
    queryId: string, 
    updates: Partial<ProjectQueryItem>
  ): boolean {
    let success = false;
    this.projects = this.projects.map(p => {
      if (p.id === projectId) {
        const updatedQueries = p.queries.map(q => {
          if (q.id === queryId) {
            success = true;
            return { ...q, ...updates };
          }
          return q;
        });
        return {
          ...p,
          queries: updatedQueries,
          updatedAt: 'Vừa xong',
        };
      }
      return p;
    });
    return success;
  }
}
