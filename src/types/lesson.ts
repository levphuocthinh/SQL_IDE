export type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ExerciseCriteria {
  expectedQuery?: string;
  expectedColumns?: string[];
  expectedRowCount?: number;
  expectedRowsMatch?: (rows: any[][], columns: string[]) => boolean;
  requiredKeywords?: string[];
  forbiddenKeywords?: string[];
  customValidation?: (sql: string, result: any, currentTables: any[]) => { success: boolean; message: string };
}

export interface QuizOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface EssayQuestion {
  question: string;
  detailedAnswer: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  slug: string;
  level: LessonLevel;
  durationMinutes: number;
  summary: string;
  theory: string; // Markdown / Vietnamese instructions
  concepts: string[];
  initialSchemaTables: string[]; // names of tables visible for this lesson
  initialSql: string;
  solutionSql: string;
  hint: string;
  quizzes?: QuizQuestion[];
  essay?: EssayQuestion;
  exercise: {
    prompt: string;
    targetDescription: string;
    criteria: ExerciseCriteria;
  };
}

export interface Chapter {
  id: string;
  title: string;
  badge: string;
  description: string;
  lessons: Lesson[];
}

