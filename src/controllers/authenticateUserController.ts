import { Request, Response } from 'express';
import { getUserByIdentifier } from '../models/userModel';
import { User } from '../../generated/prisma';
import { comparePassword } from '../utils/bcryptsPassword';

export enum ErrorCode {
  EMPTY_DATA_ERROR = 'EMPTY_DATA_ERROR',
  INVALID_CREDENTIALS_ERROR = 'INVALID_CREDENTIALS_ERROR',
}

export type ResponseData<T = Record<string, unknown>> = {
  status: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    extra?: Record<string, unknown>;
  };
};

export const resolveAuthenticateUser = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData>> => {
  const { user, password } = req.body || {};

  const requiredFields = ['user', 'password'];
  const isRequestComplete = requiredFields.every((field) => req.body?.[field]);

  if (!isRequestComplete)
    return res.json({
      status: false,
      error: {
        code: ErrorCode.EMPTY_DATA_ERROR,
        message: 'Required fields are missing from the request body.',
        extra: { requiredFields },
      },
    });

  let userObj: User;

  try {
    userObj = await getUserByIdentifier(user);

    const isPasswordValid = await comparePassword(password, userObj.password);

    if (!isPasswordValid) throw Error('The provided password does not match.');
  } catch {
    return res.json({
      status: false,
      error: {
        code: ErrorCode.INVALID_CREDENTIALS_ERROR,
        message: 'The provided credentials are invalid.',
      },
    });
  }

  return res.json({
    status: true,
    data: {
      displayName: userObj.displayName,
    },
  });
};
