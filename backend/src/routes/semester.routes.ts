import { Router } from 'express';
import { createSemester } from '../controllers/semester.controller';

const router = Router();

router.post('/', createSemester);

export default router;
