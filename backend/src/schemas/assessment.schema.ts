import { z } from 'zod';

export const updateAssessmentSchema = z.object({
  name: z.string().min(1, 'El nombre no puede estar vacío').optional(),
  grade: z.number().min(0, 'La nota no puede ser menor a 0').max(20, 'La nota no puede ser mayor a 20').optional(),
  weightPercentage: z.number().min(0, 'El porcentaje no puede ser menor a 0').max(100, 'El porcentaje no puede superar 100').optional(),
});
