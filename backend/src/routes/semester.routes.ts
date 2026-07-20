import { Router } from 'express';
import { createSemester, getSemestersByUser } from '../controllers/semester.controller';

const router = Router();

router.post('/', createSemester);
router.get('/user/:userId', getSemestersByUser);

export default router;
