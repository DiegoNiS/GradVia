import { z } from 'zod';

export const createCourseSchema = z.object({
  semesterId: z.string().uuid('ID de semestre no válido'),
  name: z.string().min(1, 'El nombre del curso es requerido'),
  targetGrade: z.number().int('La nota esperada debe ser un entero').min(0).max(20).optional().nullable(),
});

export const updateCourseSchema = z.object({
  name: z.string().min(1, 'El nombre del curso no puede estar vacío').optional(),
  isArchived: z.boolean().optional(),
  targetGrade: z.number().int('La nota esperada debe ser un entero').min(0).max(20).optional().nullable(),
});
