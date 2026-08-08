import { z } from 'zod';

export const updateAssessmentSchema = z.object({
  grade: z.number().int('La nota debe ser un entero').min(0, 'La nota no puede ser menor a 0').max(20, 'La nota no puede ser mayor a 20').optional(),
  weightPercentage: z.number().int('El porcentaje debe ser un entero').min(0, 'El porcentaje no puede ser menor a 0').max(100, 'El porcentaje no puede superar 100').optional().nullable(),
  isIncluded: z.boolean().optional(),
  targetGrade: z.number().int('La nota esperada debe ser un entero').min(0).max(20).optional().nullable(),
});
