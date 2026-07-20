import express, { Request, Response } from 'express';
import prisma from './db';
import userRoutes from './routes/user.routes';
import courseRoutes from './routes/course.routes';
import semesterRoutes from './routes/semester.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/courses', courseRoutes);

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
