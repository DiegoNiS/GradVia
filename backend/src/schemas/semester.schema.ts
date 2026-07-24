import { z } from 'zod';

export const createSemesterSchema = z.object({
  userId: z.string().uuid('ID de usuario no válido'),
  name: z.string().min(1, 'El nombre del semestre es requerido'),
  isCurrent: z.boolean().optional(),
});

export const updateSemesterSchema = z.object({
  name: z.string().min(1, 'El nombre del semestre no puede estar vacío').optional(),
  isCurrent: z.boolean().optional(),
});

export const bulkSyncAssessmentSchema = z.object({
  name: z.string().min(1, 'El nombre de la evaluación es requerido'),
  type: z.enum(['MIDTERM', 'CONTINUOUS', 'SUBSTITUTE', 'OTHER']),
  grade: z.number().min(0).max(20).optional().default(0),
  weightPercentage: z.number().min(0).max(100).optional().nullable(),
});

export const bulkSyncCourseSchema = z.object({
  name: z.string().min(1, 'El nombre del curso es requerido'),
  isArchived: z.boolean().optional().default(false),
  assessments: z.array(bulkSyncAssessmentSchema).optional().default([]),
});

export const bulkSyncSemesterSchema = z.object({
  userId: z.string().uuid('ID de usuario no válido'),
  semesterName: z.string().min(1, 'El nombre del semestre es requerido'),
  isCurrent: z.boolean().optional().default(false),
  courses: z.array(bulkSyncCourseSchema).min(1, 'Debe incluir al menos un curso'),
});
