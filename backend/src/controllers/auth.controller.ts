import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 1. Verificar si la cuenta está bloqueada temporalmente por lockoutUntil
    if (user.lockoutUntil && new Date() < user.lockoutUntil) {
      const remainingMs = user.lockoutUntil.getTime() - Date.now();
      const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
      return res.status(403).json({
        error: `Cuenta bloqueada temporalmente por superar el límite de 5 intentos fallidos. Intenta nuevamente en aproximadamente ${remainingHours} hora(s).`,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    // 2. Si la contraseña es INCORRECTA
    if (!isPasswordValid) {
      const newAttempts = user.failedAttempts + 1;
      let lockoutUntil: Date | null = user.lockoutUntil;

      if (newAttempts >= 5) {
        // Bloqueo hasta las 00:00 (medianoche) del día siguiente
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        lockoutUntil = tomorrow;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: newAttempts,
          lockoutUntil,
        },
      });

      if (newAttempts >= 5) {
        return res.status(403).json({
          error: 'Has alcanzado los 5 intentos fallidos. Tu cuenta estará bloqueada hasta las 00:00 del día de mañana.',
        });
      }

      const attemptsLeft = 5 - newAttempts;
      return res.status(401).json({
        error: `Credenciales inválidas. Te quedan ${attemptsLeft} intento(s) antes del bloqueo.`,
      });
    }

    // 3. Si la contraseña es CORRECTA -> Resetear contador de fallos y desbloquear
    if (user.failedAttempts > 0 || user.lockoutUntil !== null) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: 0,
          lockoutUntil: null,
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };

    res.status(200).json({ user: userResponse, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
