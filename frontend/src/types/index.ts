export type AssessmentType = 'MIDTERM' | 'CONTINUOUS' | 'SUBSTITUTE' | 'OTHER';

export interface Assessment {
  id: string;
  courseId: string;
  type: AssessmentType;
  number: number;
  orderIndex?: number;
  weightPercentage: number | null;
  grade: number;
  isIncluded?: boolean;
  targetGrade?: number | null;
  createdAt: string;
}

export interface Course {
  id: string;
  semesterId: string;
  name: string;
  isArchived: boolean;
  targetGrade?: number | null;
  createdAt: string;
  assessments?: Assessment[];
  
  // Computed values
  credits?: number; 
  average?: number; 
}

export interface Semester {
  id: string;
  userId: string;
  number: number;
  isCurrent: boolean;
  isArchived: boolean;
  createdAt: string;
  courses?: Course[];
  
  // Computed values
  gpa?: number; 
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  semesters?: Semester[];
}

// Estructura para Carga/Importación Masiva (Bulk Sync)
export interface BulkSyncAssessmentInput {
  type: AssessmentType;
  number?: number;
  grade?: number;
  weightPercentage?: number | null;
  isIncluded?: boolean;
  targetGrade?: number | null;
}

export interface BulkSyncCourseInput {
  name: string;
  isArchived?: boolean;
  targetGrade?: number | null;
  assessments?: BulkSyncAssessmentInput[];
}

export interface BulkSyncSemesterPayload {
  userId: string;
  isCurrent?: boolean;
  isArchived?: boolean;
  courses: BulkSyncCourseInput[];
}
