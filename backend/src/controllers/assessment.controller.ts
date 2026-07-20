import { Request, Response } from 'express';
import prisma from '../db';

export const updateAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { grade, weightPercentage } = req.body;

    const data: any = {};
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
