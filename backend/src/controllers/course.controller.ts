import { Request, Response } from 'express';
import prisma from '../db';

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { semesterId, name } = req.body;

    if (!semesterId || !name) {
      return res.status(400).json({ error: 'semesterId and name are required' });
    }

    // Regla de negocio estricta: creación del curso y de las 6 evaluaciones base de forma transaccional (nested writes)
    const course = await prisma.course.create({
      data: {
        semesterId,
        name,
        assessments: {
          create: [
            { name: "Parcial 1", type: "MIDTERM" },
            { name: "Parcial 2", type: "MIDTERM" },
            { name: "Parcial 3", type: "MIDTERM" },
            { name: "Continua 1", type: "CONTINUOUS" },
            { name: "Continua 2", type: "CONTINUOUS" },
            { name: "Continua 3", type: "CONTINUOUS" }
          ]
        }
      },
      include: {
        assessments: true // Incluimos las evaluaciones para validar en la respuesta que se crearon correctamente
      }
    });

    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCoursesBySemester = async (req: Request, res: Response) => {
  try {
    const { semesterId } = req.params;
    const courses = await prisma.course.findMany({
      where: { semesterId },
      include: {
        assessments: {
          orderBy: { createdAt: 'asc' },
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
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        assessments: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, isArchived } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (isArchived !== undefined) data.isArchived = isArchived;

    const course = await prisma.course.update({
      where: { id },
      data,
      include: {
        assessments: true,
      },
    });

    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
