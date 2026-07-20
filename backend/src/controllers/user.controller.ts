import { Request, Response } from 'express';
import prisma from '../db';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password_hash } = req.body;
    
    if (!email || !username) {
      return res.status(400).json({ error: 'Email and username are required' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: password_hash || 'mocked_hash_123',
      },
    });

    res.status(201).json({ id: user.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
