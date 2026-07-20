import { Request, Response } from 'express';
import prisma from '../db';

export const createSemester = async (req: Request, res: Response) => {
  try {
    const { userId, name, isCurrent } = req.body;
    
    if (!userId || !name) {
      return res.status(400).json({ error: 'userId and name are required' });
    }

    if (isCurrent) {
      await prisma.semester.updateMany({
        where: { userId },
        data: { isCurrent: false },
      });
    }

    const semester = await prisma.semester.create({
      data: {
        userId,
        name,
        isCurrent: isCurrent || false,
      },
    });

    res.status(201).json(semester);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSemestersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const semesters = await prisma.semester.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(semesters);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
