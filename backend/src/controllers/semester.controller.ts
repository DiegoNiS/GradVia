import { Request, Response } from 'express';
import prisma from '../db';

export const createSemester = async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const { userId, isCurrent } = req.body;
    
    // El usuario solo puede crear semestres para su propia cuenta autenticada
    const targetUserId = authUserId || userId;
    if (!targetUserId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const count = await prisma.semester.count({ where: { userId: targetUserId } });

    if (isCurrent) {
      await prisma.semester.updateMany({
        where: { userId: targetUserId },
        data: { isCurrent: false },
      });
    }

    const semester = await prisma.semester.create({
      data: {
        userId: targetUserId,
        number: count + 1,
        isCurrent: isCurrent || false,
        isArchived: false,
      },
    });

    res.status(201).json(semester);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSemestersByUser = async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const { userId } = req.params;

    // Verificar que el usuario solicita sus propios semestres
    if (authUserId && authUserId !== userId) {
      return res.status(403).json({ error: 'Acceso no autorizado a semestres de otro usuario' });
    }

    const semesters = await prisma.semester.findMany({
      where: { userId },
      orderBy: { number: 'asc' },
    });
    res.status(200).json(semesters);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSemesterById = async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const { id } = req.params;

    // Consulta con verificación de propiedad por usuario
    const semester = await prisma.semester.findFirst({
      where: {
        id,
        userId: authUserId,
      },
      include: {
        courses: {
          include: {
            assessments: {
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!semester) {
      return res.status(404).json({ error: 'Semestre no encontrado o no autorizado' });
    }

    res.status(200).json(semester);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSemester = async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const { id } = req.params;
    const { isCurrent, isArchived } = req.body;

    const existingSemester = await prisma.semester.findFirst({
      where: { id, userId: authUserId },
    });

    if (!existingSemester) {
      return res.status(404).json({ error: 'Semestre no encontrado o no autorizado' });
    }

    if (isCurrent === true) {
      await prisma.semester.updateMany({
        where: { userId: existingSemester.userId },
        data: { isCurrent: false },
      });
    }

    const data: any = {};
    if (isCurrent !== undefined) data.isCurrent = isCurrent;
    if (isArchived !== undefined) data.isArchived = isArchived;

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
    const authUserId = (req as any).user?.userId;
    const { id } = req.params;

    const existingSemester = await prisma.semester.findFirst({
      where: { id, userId: authUserId },
    });

    if (!existingSemester) {
      return res.status(404).json({ error: 'Semestre no encontrado o no autorizado' });
    }

    await prisma.semester.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Semestre eliminado exitosamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkSyncSemester = async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const { userId, isCurrent, courses } = req.body;
    const targetUserId = authUserId || userId;

    const result = await prisma.$transaction(async (tx) => {
      if (isCurrent) {
        await tx.semester.updateMany({
          where: { userId: targetUserId },
          data: { isCurrent: false },
        });
      }

      const count = await tx.semester.count({ where: { userId: targetUserId } });
      let semester = await tx.semester.findFirst({
        where: { userId: targetUserId },
        orderBy: { number: 'desc' },
      });

      if (semester) {
        semester = await tx.semester.update({
          where: { id: semester.id },
          data: {
            isCurrent: isCurrent || false,
          },
        });
      } else {
        semester = await tx.semester.create({
          data: {
            userId: targetUserId,
            number: count + 1,
            isCurrent: isCurrent || false,
            isArchived: false,
          },
        });
      }

      for (const courseItem of courses) {
        let course = await tx.course.findFirst({
          where: { semesterId: semester.id, name: courseItem.name },
        });

        if (course) {
          course = await tx.course.update({
            where: { id: course.id },
            data: {
              isArchived: courseItem.isArchived ?? course.isArchived,
              targetGrade: courseItem.targetGrade !== undefined ? courseItem.targetGrade : course.targetGrade,
            },
          });
        } else {
          course = await tx.course.create({
            data: {
              semesterId: semester.id,
              name: courseItem.name,
              isArchived: false,
              targetGrade: courseItem.targetGrade || null,
            },
          });
        }

        if (courseItem.assessments && courseItem.assessments.length > 0) {
          let midtermCount = 0;
          let continuousCount = 0;

          for (const assItem of courseItem.assessments) {
            let num = assItem.number;
            if (!num) {
              if (assItem.type === 'MIDTERM') {
                midtermCount++;
                num = midtermCount;
              } else if (assItem.type === 'CONTINUOUS') {
                continuousCount++;
                num = continuousCount;
              } else {
                num = 1;
              }
            }

            let assessment = await tx.assessment.findFirst({
              where: { courseId: course.id, type: assItem.type, number: num },
            });

            if (assessment) {
              await tx.assessment.update({
                where: { id: assessment.id },
                data: {
                  grade: assItem.grade !== undefined ? assItem.grade : assessment.grade,
                  weightPercentage: assItem.weightPercentage !== undefined ? assItem.weightPercentage : assessment.weightPercentage,
                  isIncluded: assItem.isIncluded !== undefined ? assItem.isIncluded : assessment.isIncluded,
                  targetGrade: assItem.targetGrade !== undefined ? assItem.targetGrade : assessment.targetGrade,
                },
              });
            } else {
              await tx.assessment.create({
                data: {
                  courseId: course.id,
                  type: assItem.type,
                  number: num,
                  grade: assItem.grade ?? 0,
                  weightPercentage: assItem.weightPercentage ?? null,
                  isIncluded: assItem.isIncluded !== undefined ? assItem.isIncluded : true,
                  targetGrade: assItem.targetGrade || null,
                },
              });
            }
          }
        }
      }

      return await tx.semester.findUnique({
        where: { id: semester.id },
        include: {
          courses: {
            include: {
              assessments: {
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
        },
      });
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
