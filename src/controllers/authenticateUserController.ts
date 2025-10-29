import { Request, Response } from 'express';
import { getUserByIdentifier } from '../models/userModel';
import { User } from '../../generated/prisma';
import { isPasswordMatch } from '../utils/bcryptsPassword';
import { generateToken } from '../utils/jwt';
import { ErrorCode } from '../constants/enums';
import { ResponseData } from '../types/response';
import { errorResponse as formatErrorResponse } from '../utils/formatResponse';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library';
import { InvalidCredentialsError } from '../constants/exceptions';
import z from 'zod';

const AuthSchema = z.object({
  user: z.string().min(1, 'The "user" field is required and must be a non-empty string.'),
  password: z.string().min(1, 'The "password" field is required and must be a non-empty string.'),
});

export const resolveAuthenticateUser = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData>> => {
  const fieldsRequired: Record<string, string> = {
    user: 'user: string',
    password: 'password: string',
  };

  const parsed = AuthSchema.safeParse(req.body);

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

  const { user, password } = parsed.data;

  let userObj: User;

  try {
    userObj = await getUserByIdentifier(user);

    const isPasswordValid = await isPasswordMatch(password, userObj.password);

    if (!isPasswordValid)
      throw new InvalidCredentialsError('The provided password does not match.');
  } catch (err) {
    if (
      (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') ||
      err instanceof InvalidCredentialsError
    ) {
      return formatErrorResponse(res, {
        errorCode: ErrorCode.INVALID_CREDENTIALS_ERROR,
        message: 'The provided credentials are invalid.',
      });
    }

    return formatErrorResponse(res, {
      errorCode: ErrorCode.NOT_FOUND_ERROR,
      message: 'Resource not found.',
    });
  }

  const token = generateToken({
    id: userObj.id,
    userType: userObj.userType,
  });

  return res.json({
    status: true,
    data: {
      displayName: userObj.displayName,
      token,
    },
  });
};
