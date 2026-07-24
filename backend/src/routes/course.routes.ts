import { Router } from 'express';
import {
  createCourse,
  getCoursesBySemester,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller';
import { validateBody } from '../middleware/validate.middleware';
import { createCourseSchema, updateCourseSchema } from '../schemas/course.schema';

const router = Router();

router.post('/', validateBody(createCourseSchema), createCourse);
router.get('/semester/:semesterId', getCoursesBySemester);
router.get('/:id', getCourseById);
router.patch('/:id', validateBody(updateCourseSchema), updateCourse);
router.delete('/:id', deleteCourse);

export default router;
