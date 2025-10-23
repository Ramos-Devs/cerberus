import { Request, Response } from 'express';
import { UserType } from '../constants/enums';
import { createNewUser } from '../models/userModel';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';

export const resolveRegisterUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, displayName, password } = req.body || {};

  const requiredFields = ['username', 'email', 'displayName', 'password'];

  const isRequestComplete = requiredFields.every((field) => req.body?.[field]);

  if (!isRequestComplete) return res.json({ message: 'Error' });

  const userType = UserType.USER;

  try {
    // TODO: tipar datos en el model
    await createNewUser(username, email, displayName, password, userType);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002')
      // const fields = (err.meta as any)?.['target'];
      return res.json({ message: 'Error' });
  }

  return res.json({ message: 'Success' });
};
