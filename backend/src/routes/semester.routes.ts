import { Router } from 'express';
import {
  createSemester,
  getSemestersByUser,
  getSemesterById,
  updateSemester,
  deleteSemester,
} from '../controllers/semester.controller';
import { validateBody } from '../middleware/validate.middleware';
import { createSemesterSchema, updateSemesterSchema } from '../schemas/semester.schema';

const router = Router();

router.post('/', validateBody(createSemesterSchema), createSemester);
router.get('/user/:userId', getSemestersByUser);
router.get('/:id', getSemesterById);
router.patch('/:id', validateBody(updateSemesterSchema), updateSemester);
router.delete('/:id', deleteSemester);

export default router;
