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
        passwordHash: password_hash,
      },
    });

    res.status(201).json({ id: user.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const { id } = req.params;

    if (authUserId !== id) {
      return res.status(403).json({ error: 'Acceso no autorizado al perfil de otro usuario' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const { id } = req.params;
    const { email, username, password_hash } = req.body;

    if (authUserId !== id) {
      return res.status(403).json({ error: 'Acceso no autorizado para modificar otro usuario' });
    }

    const data: any = {};
    if (email) data.email = email;
    if (username) data.username = username;
    if (password_hash) data.passwordHash = password_hash;

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
      },
    });

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const authUserId = (req as any).user?.userId;
    const { id } = req.params;

    if (authUserId !== id) {
      return res.status(403).json({ error: 'Acceso no autorizado para eliminar otro usuario' });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
