import { Request, Response } from 'express';
import prisma from '../db';

export const createAssessment = async (req: Request, res: Response) => {
  try {
    const { courseId, name, type, weightPercentage, grade } = req.body;

    if (!courseId || !name || !type) {
      return res.status(400).json({ error: 'courseId, name, and type are required' });
    }

    const assessment = await prisma.assessment.create({
      data: {
        courseId,
        name,
        type,
        weightPercentage,
        grade: grade || 0,
      },
    });

    res.status(201).json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssessmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assessment = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.status(200).json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, grade, weightPercentage } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (grade !== undefined) data.grade = grade;
    if (weightPercentage !== undefined) data.weightPercentage = weightPercentage;

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
    const { id } = req.params;
    await prisma.assessment.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
