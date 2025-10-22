import { Request, Response } from 'express';
import { getUserByIdentifier } from '../models/userModel';
import { User } from '../../generated/prisma';
import { isPasswordMatch } from '../utils/bcryptsPassword';
import { generateToken } from '../utils/jwt';
import { ErrorCode } from '../constants/enums';
import { ResponseData } from '../types/response';
import { errorResponse as formatErrorResponse } from '../utils/formatResponse';

export const resolveAuthenticateUser = async (
  req: Request,
  res: Response
): Promise<Response<ResponseData>> => {
  const { user, password } = req.body || {};

  const requiredFields = ['user', 'password'];
  const isRequestComplete = requiredFields.every((field) => req.body?.[field]);

  if (!isRequestComplete)
    return formatErrorResponse(res, {
      errorCode: ErrorCode.EMPTY_DATA_ERROR,
      message: 'Required fields are missing from the request body.',
      extra: { requiredFields },
    });

  let userObj: User;

  try {
    userObj = await getUserByIdentifier(user);

    const isPasswordValid = await isPasswordMatch(password, userObj.password);

    if (!isPasswordValid) throw Error('The provided password does not match.');
  } catch {
    return formatErrorResponse(res, {
      errorCode: ErrorCode.INVALID_CREDENTIALS_ERROR,
      message: 'The provided credentials are invalid.',
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
