import { Request, Response } from 'express';

export const resolveAuthenticateUser = async (req: Request, res: Response): Promise<Response> => {
  const { user, password } = req.body || {};

  if (!user || !password) return res.json({ message: 'Error' });

  return res.json({ message: 'Success' });
};
