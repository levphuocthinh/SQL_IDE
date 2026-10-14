export type RoleType = 'learner' | 'instructor' | 'support' | 'super_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatarText: string;
  streakDays: number;
  maxStreak: number;
  totalHours: number;
  weekHours: number;
  completedLessons: number;
  totalLessons: number;
  skillPoints: number;
  level: string;
  weeklyGoalDays: number;
  completedDaysThisWeek: number;
  status: 'active' | 'blocked' | 'warning';
  lastActive: string;
  currentCourseTitle: string;
  currentLessonTitle: string;
  stuckLessonTitle?: string;
}

export interface CourseLessonItem {
  id: string;
  title: string;
  durationMinutes: number;
  status: 'completed' | 'in_progress' | 'not_started' | 'locked';
  exerciseId?: string;
  theoryExcerpt?: string;
}

export interface CourseChapterItem {
  id: string;
  title: string;
  lessons: CourseLessonItem[];
}

export interface CourseItem {
  id: string;
  title: string;
  tagline: string;
  badgeText: string;
  colorTheme: 'blue' | 'purple' | 'emerald';
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  chapters: CourseChapterItem[];
}

export interface ProjectQueryItem {
  id: string;
  name: string;
  sql: string;
  lastRun?: string;
  lastStatus?: 'success' | 'error';
  rowCount?: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  engine: 'PostgreSQL' | 'MySQL' | 'SQLite';
  queryCount: number;
  updatedAt: string;
  notes: string;
  queries: ProjectQueryItem[];
}

export interface StudentManagementItem extends UserProfile {
  enrolledCourseTitles: string[];
  completedLessonTitles: string[];
  pendingLessonTitles: string[];
  recentActivities: {
    id: string;
    timestamp: string;
    action: string;
    scoreDelta?: number;
  }[];
  supportNotes: {
    id: string;
    author: string;
    date: string;
    content: string;
  }[];
  projectsCount: number;
}

export interface RoleConfig {
  role: RoleType;
  title: string;
  description: string;
  color: string;
  permissions: string[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  ip: string;
  status: 'success' | 'warning' | 'danger';
}

export type LearnerNavTab = 'overview' | 'practice' | 'courses' | 'projects' | 'profile';
export type AdminNavTab = 'admin-dashboard' | 'admin-students' | 'admin-courses' | 'admin-exercises' | 'admin-roles' | 'admin-audit';
export type AppNavTab = LearnerNavTab | AdminNavTab;
