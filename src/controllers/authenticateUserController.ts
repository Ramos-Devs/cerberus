import { Request, Response } from 'express';
import { getUserByIdentifier } from '../models/userModel';
import { User } from '../../generated/prisma';

export const resolveAuthenticateUser = async (req: Request, res: Response): Promise<Response> => {
  const { user, password } = req.body || {};

  if (!user || !password) return res.json({ message: 'Error' });

  let userObj: User;

  try {
    userObj = await getUserByIdentifier(user);
  } catch {
    return res.json({ message: 'Error' });
  }

  if (!userObj || userObj.password !== password) return res.json({ message: 'Error' });

  return res.json({ message: 'Success' });
};
