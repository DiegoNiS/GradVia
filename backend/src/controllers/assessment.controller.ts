import { Request, Response } from 'express';
import prisma from '../db';

export const createAssessment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { courseId, type, weightPercentage, grade, isIncluded, targetGrade } = req.body;

    if (!courseId || !type) {
      return res.status(400).json({ error: 'courseId and type are required' });
    }

    // Validar propiedad del curso a través del semestre del usuario
    const course = await prisma.course.findFirst({
      where: { id: courseId, semester: { userId } },
    });

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado o no autorizado' });
    }

    const assessment = await prisma.assessment.create({
      data: {
        courseId,
        type,
        weightPercentage,
        grade: grade || 0,
        isIncluded: isIncluded !== undefined ? isIncluded : true,
        targetGrade: targetGrade || null,
      },
    });

    res.status(201).json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssessmentById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    const assessment = await prisma.assessment.findFirst({
      where: {
        id,
        course: { semester: { userId } },
      },
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Evaluación no encontrada o no autorizada' });
    }

    res.status(200).json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAssessment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;
    const { grade, weightPercentage, isIncluded, targetGrade } = req.body;

    const existingAssessment = await prisma.assessment.findFirst({
      where: { id, course: { semester: { userId } } },
    });

    if (!existingAssessment) {
      return res.status(404).json({ error: 'Evaluación no encontrada o no autorizada' });
    }

    const data: any = {};
    if (grade !== undefined) data.grade = grade;
    if (weightPercentage !== undefined) data.weightPercentage = weightPercentage;
    if (isIncluded !== undefined) data.isIncluded = isIncluded;
    if (targetGrade !== undefined) data.targetGrade = targetGrade;

    const assessment = await prisma.assessment.update({
      where: { id },
      data,
    });

    res.status(200).json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAssessment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    const existingAssessment = await prisma.assessment.findFirst({
      where: { id, course: { semester: { userId } } },
    });

    if (!existingAssessment) {
      return res.status(404).json({ error: 'Evaluación no encontrada o no autorizada' });
    }

    await prisma.assessment.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Evaluación eliminada exitosamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
