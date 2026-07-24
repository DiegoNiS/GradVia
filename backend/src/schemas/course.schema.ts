import { z } from 'zod';

export const createCourseSchema = z.object({
  semesterId: z.string().uuid('ID de semestre no válido'),
  name: z.string().min(1, 'El nombre del curso es requerido'),
});

export const updateCourseSchema = z.object({
  name: z.string().min(1, 'El nombre del curso no puede estar vacío').optional(),
  isArchived: z.boolean().optional(),
});
