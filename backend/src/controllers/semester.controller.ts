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

export const getSemesterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const semester = await prisma.semester.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            assessments: true,
          },
        },
      },
    });

    if (!semester) {
      return res.status(404).json({ error: 'Semester not found' });
    }

    res.status(200).json(semester);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSemester = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, isCurrent } = req.body;

    const existingSemester = await prisma.semester.findUnique({ where: { id } });
    if (!existingSemester) {
      return res.status(404).json({ error: 'Semester not found' });
    }

    if (isCurrent === true) {
      await prisma.semester.updateMany({
        where: { userId: existingSemester.userId },
        data: { isCurrent: false },
      });
    }

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (isCurrent !== undefined) data.isCurrent = isCurrent;

    const semester = await prisma.semester.update({
      where: { id },
      data,
    });

    res.status(200).json(semester);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSemester = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.semester.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Semester deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
