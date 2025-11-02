import { Request, Response } from 'express';
import { ErrorCode, UserType } from '../constants/enums';
import { createNewUser } from '../models/userModel';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import z from 'zod';
import { formatErrorResponse } from '../utils/formatResponse';

const UserSchema = z.object({
  username: z.string().min(1, 'The "username" field is required and must be a non-empty string.'),
  email: z.string().min(1, 'The "email" field is required and must be a non-empty string.'),
  displayName: z
    .string()
    .min(1, 'The "displayName" field is required and must be a non-empty string.'),
  password: z.string().min(1, 'The "password" field is required and must be a non-empty string.'),
});

// Return response data
export const resolveRegisterUser = async (req: Request, res: Response): Promise<Response> => {
  const fieldsRequired: Record<string, string> = {
    username: 'username: string',
    email: 'email: string',
    displayName: 'displayName: string',
    password: 'password: string',
  };

  const parsed = UserSchema.safeParse(req.body);

  if (!parsed.success) {
    const invalidFields = parsed.error.issues.map((issue) => {
      const field = issue.path.join('.');
      return fieldsRequired[field];
    });

    return formatErrorResponse(res, {
      errorCode: ErrorCode.EMPTY_DATA_ERROR,
      message: 'Required fields are missing from the request body.',
      extra: { invalidFields },
    });
  }

  // -->
  const { username, email, displayName, password } = req.body || {};

  const requiredFields = ['username', 'email', 'displayName', 'password'];

  const isRequestComplete = requiredFields.every((field) => req.body?.[field]);

  if (!isRequestComplete) return res.json({ message: 'Error' });

  const userType = UserType.USER;

  let userObj;

  try {
    // TODO: tipar datos en el model
    userObj = await createNewUser(username, email, displayName, password, userType);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002')
      // const fields = (err.meta as any)?.['target'];
      // Error cuando unique field exist
      return res.json({ message: 'Error' });
    return res.json({ message: 'Error' });
  }

  return res.json({
    status: true,
    data: { displayName: userObj.displayName },
  });
};
