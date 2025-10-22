import { Request, Response } from 'express';

export const resolveRegisterUser = async (_req: Request, res: Response): Promise<Response> => {
  return res.json({ message: 'Success' });
};
