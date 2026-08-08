export type AssessmentType = 'MIDTERM' | 'CONTINUOUS' | 'SUBSTITUTE' | 'OTHER';

export interface Assessment {
  id: string;
  courseId: string;
  name: string;
  type: AssessmentType;
  weightPercentage: number | null;
  grade: number;
  createdAt: string;
}

export interface Course {
  id: string;
  semesterId: string;
  name: string;
  isArchived: boolean;
  createdAt: string;
  assessments?: Assessment[]; // Eager loaded from API
  
  // Computed values (frontend fallback logic uses these if populated)
  credits?: number; 
  average?: number; 
}

export interface Semester {
  id: string;
  userId: string;
  name: string;
  isCurrent: boolean;
  createdAt: string;
  courses?: Course[]; // Eager loaded from API
  
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
  name: string;
  type: AssessmentType;
  grade?: number;
  weightPercentage?: number | null;
}

export interface BulkSyncCourseInput {
  name: string;
  isArchived?: boolean;
  assessments?: BulkSyncAssessmentInput[];
}

export interface BulkSyncSemesterPayload {
  userId: string;
  semesterName: string;
  isCurrent?: boolean;
  courses: BulkSyncCourseInput[];
}
