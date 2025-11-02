import { Response } from 'express';
import { ErrorCode } from '../constants/enums';
import { ResponseData } from '../types/response';

interface ErrorOptions {
  errorCode: ErrorCode;
  message: string;
  extra?: Record<string, unknown>;
}

export const formatErrorResponse = (
  res: Response,
  { errorCode, message, extra }: ErrorOptions
): Response<ResponseData> => {
  return res.json({
    status: false,
    error: {
      code: errorCode,
      message,
      ...(extra && { extra }),
    },
  });
};
