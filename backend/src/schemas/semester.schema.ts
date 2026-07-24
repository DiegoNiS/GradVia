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
