import { z } from 'zod';

export const createSemesterSchema = z.object({
  userId: z.string().uuid('ID de usuario no válido'),
  number: z.number().int('El número de semestre debe ser un número entero').min(1).max(30).optional(),
  isCurrent: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export const updateSemesterSchema = z.object({
  isCurrent: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export const bulkSyncAssessmentSchema = z.object({
  type: z.enum(['MIDTERM', 'CONTINUOUS', 'SUBSTITUTE', 'OTHER']),
  number: z.number().int().optional(),
  grade: z.number().int().min(0).max(20).optional().default(0),
  weightPercentage: z.number().int().min(0).max(100).optional().nullable(),
  isIncluded: z.boolean().optional().default(true),
  targetGrade: z.number().int().min(0).max(20).optional().nullable(),
});

export const bulkSyncCourseSchema = z.object({
  name: z.string().min(1, 'El nombre del curso es requerido'),
  isArchived: z.boolean().optional().default(false),
  targetGrade: z.number().int().min(0).max(20).optional().nullable(),
  assessments: z.array(bulkSyncAssessmentSchema).optional().default([]),
});

export const bulkSyncSemesterSchema = z.object({
  userId: z.string().uuid('ID de usuario no válido'),
  isCurrent: z.boolean().optional().default(false),
  isArchived: z.boolean().optional().default(false),
  courses: z.array(bulkSyncCourseSchema).min(1, 'Debe incluir al menos un curso'),
});
