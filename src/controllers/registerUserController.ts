import { Request, Response } from 'express';

export const resolveRegisterUser = async (req: Request, res: Response): Promise<Response> => {
  const requiredFields = ['username', 'email', 'displayName', 'password'];

  const isRequestComplete = requiredFields.every((field) => req.body?.[field]);

  if (!isRequestComplete) return res.json({ message: 'Error' });

  return res.json({ message: 'Success' });
};
