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

export const bulkSyncSemester = async (req: Request, res: Response) => {
  try {
    const { userId, semesterName, isCurrent, courses } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      if (isCurrent) {
        await tx.semester.updateMany({
          where: { userId },
          data: { isCurrent: false },
        });
      }

      let semester = await tx.semester.findFirst({
        where: { userId, name: semesterName },
      });

      if (semester) {
        semester = await tx.semester.update({
          where: { id: semester.id },
          data: { isCurrent: isCurrent || false },
        });
      } else {
        semester = await tx.semester.create({
          data: {
            userId,
            name: semesterName,
            isCurrent: isCurrent || false,
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
            data: { isArchived: courseItem.isArchived ?? course.isArchived },
          });
        } else {
          course = await tx.course.create({
            data: {
              semesterId: semester.id,
              name: courseItem.name,
              isArchived: courseItem.isArchived ?? false,
            },
          });
        }

        if (courseItem.assessments && courseItem.assessments.length > 0) {
          for (const assItem of courseItem.assessments) {
            let assessment = await tx.assessment.findFirst({
              where: { courseId: course.id, name: assItem.name },
            });

            if (assessment) {
              await tx.assessment.update({
                where: { id: assessment.id },
                data: {
                  grade: assItem.grade !== undefined ? assItem.grade : assessment.grade,
                  weightPercentage: assItem.weightPercentage !== undefined ? assItem.weightPercentage : assessment.weightPercentage,
                  type: assItem.type || assessment.type,
                },
              });
            } else {
              await tx.assessment.create({
                data: {
                  courseId: course.id,
                  name: assItem.name,
                  type: assItem.type,
                  grade: assItem.grade ?? 0,
                  weightPercentage: assItem.weightPercentage ?? null,
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
              assessments: true,
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
