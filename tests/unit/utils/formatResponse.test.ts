import { formatErrorResponse } from '../../../src/utils/formatResponse';
import { ErrorCode } from '../../../src/constants/enums';
import { Response } from 'express';

test('formatErrorResponse should return a formatted error response', () => {
  const mockJson = jest.fn();
  const mockResponse: Partial<Response> = {
    json: mockJson,
  };

  const errorData = {
    errorCode: ErrorCode.EMPTY_DATA_ERROR,
    message: 'Missing required fields.',
    extra: { invalidFields: ['email'] },
  };

  formatErrorResponse(mockResponse as Response, errorData);

  expect(mockJson).toHaveBeenCalledWith({
    status: false,
    error: {
      code: errorData.errorCode,
      message: errorData.message,
      extra: errorData.extra,
    },
  });
});
