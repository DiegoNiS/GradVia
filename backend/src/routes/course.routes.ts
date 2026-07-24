import { Router } from 'express';
import {
  createCourse,
  getCoursesBySemester,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/course.controller';

const router = Router();

router.post('/', createCourse);
router.get('/semester/:semesterId', getCoursesBySemester);
router.get('/:id', getCourseById);
router.patch('/:id', updateCourse);
router.delete('/:id', deleteCourse);

export default router;
