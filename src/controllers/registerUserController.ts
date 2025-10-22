import { Request, Response } from 'express';

export const resolveRegisterUser = async (req: Request, res: Response): Promise<Response> => {
  const dataBody = req.body;

  if (!dataBody || Object.keys(dataBody).length === 0) return res.json({ message: 'Error' });

  return res.json({ message: 'Success' });
};
