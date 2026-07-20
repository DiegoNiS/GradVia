import { Router } from 'express';
import { createCourse } from '../controllers/course.controller';

const router = Router();

router.post('/', createCourse);

export default router;
