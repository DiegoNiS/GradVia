import { Router } from 'express';
import {
  createSemester,
  getSemestersByUser,
  getSemesterById,
  updateSemester,
  deleteSemester,
} from '../controllers/semester.controller';

const router = Router();

router.post('/', createSemester);
router.get('/user/:userId', getSemestersByUser);
router.get('/:id', getSemesterById);
router.patch('/:id', updateSemester);
router.delete('/:id', deleteSemester);

export default router;
