import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import prisma from './db';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import semesterRoutes from './routes/semester.routes';
import assessmentRoutes from './routes/assessment.routes';
import authRoutes from './routes/auth.routes';
import { authenticateToken } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/semesters', authenticateToken as any, semesterRoutes);
app.use('/api/courses', authenticateToken as any, courseRoutes);
app.use('/api/assessments', authenticateToken as any, assessmentRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running correctly.' });
});

app.get('/api/db-check', async (req: Request, res: Response) => {
  try {
    const count = await prisma.user.count();
    res.status(200).json({ status: 'ok', message: 'Database connected successfully.', userCount: count });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: 'Database connection failed.', error: error.message });
  }
});

// Manejador global de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
