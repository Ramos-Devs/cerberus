import { Request, Response } from 'express';

export const resolveAuthenticateUser = async (req: Request, res: Response): Promise<Response> => {
  const { body } = req;

  if (!body) {
    return res.json({ message: 'Error' });
  }

  return res.json({ message: 'Success' });
};
