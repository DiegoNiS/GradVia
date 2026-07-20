import { Router } from 'express';
import { createCourse, getCoursesBySemester } from '../controllers/course.controller';

const router = Router();

router.post('/', createCourse);
router.get('/semester/:semesterId', getCoursesBySemester);

export default router;
