import { Router } from 'express';
import {
  createAssessment,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
} from '../controllers/assessment.controller';

const router = Router();

router.post('/', createAssessment);
router.get('/:id', getAssessmentById);
router.patch('/:id', updateAssessment);
router.delete('/:id', deleteAssessment);

export default router;
