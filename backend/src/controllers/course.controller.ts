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
