import { Request, Response } from 'express';
import prisma from '../db';

export const createCourse = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { semesterId, name, targetGrade } = req.body;

    if (!semesterId || !name) {
      return res.status(400).json({ error: 'semesterId y name son requeridos' });
    }

    // Validar propiedad del semestre
    const semester = await prisma.semester.findFirst({
      where: { id: semesterId, userId },
    });

    if (!semester) {
      return res.status(404).json({ error: 'Semestre no encontrado o no autorizado' });
    }

    const course = await prisma.course.create({
      data: {
        semesterId,
        name,
        targetGrade: targetGrade || null,
        assessments: {
          create: [
            { type: "CONTINUOUS", number: 1, orderIndex: 1 },
            { type: "MIDTERM", number: 1, orderIndex: 2 },
            { type: "CONTINUOUS", number: 2, orderIndex: 3 },
            { type: "MIDTERM", number: 2, orderIndex: 4 },
            { type: "CONTINUOUS", number: 3, orderIndex: 5 },
            { type: "MIDTERM", number: 3, orderIndex: 6 },
          ]
        }
      },
      include: {
        assessments: {
          orderBy: { orderIndex: 'asc' },
        }
      }
    });

    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCoursesBySemester = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { semesterId } = req.params;

    // Control de acceso estricto: verificar que el semestre pertenece al usuario autenticado
    const semester = await prisma.semester.findFirst({
      where: { id: semesterId, userId },
    });

    if (!semester) {
      return res.status(404).json({ error: 'Semestre no encontrado o no autorizado' });
    }

    const courses = await prisma.course.findMany({
      where: { semesterId },
      include: {
        assessments: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
    res.status(200).json(courses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    // Control de acceso estricto: verificar propiedad a través de la relación semestre -> usuario
    const course = await prisma.course.findFirst({
      where: {
        id,
        semester: { userId },
      },
      include: {
        assessments: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado o no autorizado' });
    }

    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;
    const { name, isArchived, targetGrade } = req.body;

    const existingCourse = await prisma.course.findFirst({
      where: { id, semester: { userId } },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Curso no encontrado o no autorizado' });
    }

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (isArchived !== undefined) data.isArchived = isArchived;
    if (targetGrade !== undefined) data.targetGrade = targetGrade;

    const course = await prisma.course.update({
      where: { id },
      data,
      include: {
        assessments: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    const existingCourse = await prisma.course.findFirst({
      where: { id, semester: { userId } },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: 'Curso no encontrado o no autorizado' });
    }

    await prisma.course.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Curso eliminado exitosamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
