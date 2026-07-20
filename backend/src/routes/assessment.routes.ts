import { Router } from 'express';
import { updateAssessment } from '../controllers/assessment.controller';

const router = Router();

router.patch('/:id', updateAssessment);

export default router;
