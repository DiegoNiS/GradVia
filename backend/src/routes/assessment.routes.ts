import { Router } from 'express';
import {
  createAssessment,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
} from '../controllers/assessment.controller';
import { validateBody } from '../middleware/validate.middleware';
import { updateAssessmentSchema } from '../schemas/assessment.schema';

const router = Router();

router.post('/', createAssessment);
router.get('/:id', getAssessmentById);
router.patch('/:id', validateBody(updateAssessmentSchema), updateAssessment);
router.delete('/:id', deleteAssessment);

export default router;
