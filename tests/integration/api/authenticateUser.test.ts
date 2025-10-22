import request from 'supertest';
import app from '../../../src/app';
import { userDefaultHelper } from '../__helpers__/userDataHelper';
import { prismaMock } from '../__mocks__/dbMock';
import * as jwtUtils from "../../../src/utils/jwt";
import { ErrorCode } from '../../../src/constants/enums';

const URL_ENDPOINT = '/auth/authenticate-user';

describe('User authentication successful', () => {
  it.each([
    ['username', 'username-example'],
    ['email', 'example@test.com'],
  ])(
    'should return data when credentials are valid using %s',
    async (_field, identifier) => {
      const { userData, password } = await userDefaultHelper();

      prismaMock.user.findFirstOrThrow.mockResolvedValue(userData);

      const token = "mocked_jwt_token"
      jest.spyOn(jwtUtils, "generateToken").mockReturnValue(token);
    
      const response = await request(app)
        .post(URL_ENDPOINT)
        .send({
          user: identifier,
          password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        status: true,
        data: { 
          displayName: userData.displayName,
          token,
        }
     });
    }
  );
});

describe('User authentication failed', () => {
  it('should return an error when the requets body is empty', async () => {
    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ 
      status: false,
      error: {
        code: ErrorCode.EMPTY_DATA_ERROR,
        message: 'Required fields are missing from the request body.',
        extra: { 
          requiredFields: ['user', 'password'],
        },
      },
     });
  });

  it('should return an error when required fields are empty', async () => {
    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({
        user: '',
        password: '',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ 
      status: false,
      error: {
        code: ErrorCode.EMPTY_DATA_ERROR,
        message: 'Required fields are missing from the request body.',
        extra: { 
          requiredFields: ['user', 'password'],
        },
      },
    });
  });

  it.each([
    ['password is missing', { user: 'test@example.com' }],
    ['user is missing', { password: 'pass-example' }],
    ['user and password is missing', { otherValue: 'value-example' }],
  ])(
    'should return an error when the required %s', 
    async (_msg: string, body: Record<string, any>) => {
      const response = await request(app)
        .post(URL_ENDPOINT)
        .send(body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        status: false,
        error: {
          code: ErrorCode.EMPTY_DATA_ERROR,
          message: 'Required fields are missing from the request body.',
          extra: { 
            requiredFields: ['user', 'password'],
          },
        },
      });
    }
  );

  it('should return an error when a user does not exist', async () => {
    prismaMock.user.findFirstOrThrow.mockRejectedValue(
      new Error('User not found')
    );

    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({
        user: 'user-not-exist',
        password: 'password-example',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ 
      status: false,
      error: {
        code: ErrorCode.INVALID_CREDENTIALS_ERROR,
        message: 'The provided credentials are invalid.',
      },
    });
  });

  it('should return an error when the credentials are invalid', async () => {
    const { userData } = await userDefaultHelper();

    prismaMock.user.findFirstOrThrow.mockResolvedValue(userData);

    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({
        user: userData.username,
        password: 'pasword-invalid',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ 
      status: false,
      error: {
        code: ErrorCode.INVALID_CREDENTIALS_ERROR,
        message: 'The provided credentials are invalid.',
      },
    });
  });
});
