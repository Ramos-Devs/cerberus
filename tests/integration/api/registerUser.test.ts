import request from 'supertest';
import app from '../../../src/app';
import { prismaMock } from '../__mocks__/dbMock';
import { PrismaClientKnownRequestError } from '../../../generated/prisma/runtime/library';
import { userDefaultHelper } from '../__helpers__/userDataHelper';
import { ErrorCode } from '../../../src/constants/enums';

const URL_ENDPOINT = '/auth/register-user';

describe('User registration successful', () => {
  it('should return data when a user registers', async () => {
    const { userData } = await userDefaultHelper();
    
    prismaMock.user.create.mockResolvedValue(userData);

    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({
      username: 'test.example',
      email: 'test@example.com',
      displayName: userData.displayName,
      password: 'password-example',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ 
      status: true,
      data: { displayName: userData.displayName },
    });
  });
});

describe('User registration failed', () => {
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
        extra: { invalidFields: [
          'username: string', 
          'email: string',
          'displayName: string',
          'password: string',
        ]},
      },
    });
  });

  it('should return an error when required fields are empty', async () => {
    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({
        username: '',
        email: '',
        displayName: '',
        password: '',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({  
      status: false,
      error: {
        code: ErrorCode.EMPTY_DATA_ERROR,
        message: 'Required fields are missing from the request body.',
        extra: { invalidFields: [
          'username: string', 
          'email: string',
          'displayName: string',
          'password: string',
        ]},
      },
    });
  });

  it.each([
    [
      'username already exist', 
      'username', 
      ['username: string'],
    ], 
    [
      'email already exist', 
      'email', 
      ['email: string'],
    ],
  ])('should return an error when unique %s', async (
    _msg: string, 
    fieldName: string, 
    expectedInvalidFields: string[],
  ) => {
    const prismaError = new PrismaClientKnownRequestError(
      `Unique constraint failed on the fields: (\`${fieldName}\`)`,
      {
        code: 'P2002',
        clientVersion: '6.17.1',
        meta: { modelName: 'User', target: [fieldName] },
      }
    );

    prismaMock.user.create.mockRejectedValue(prismaError);

    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({
        username: 'test.example',
        email: 'test@example.com',
        displayName: 'Test Example',
        password: 'password-example',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({  
      status: false,
      error: {
        code: ErrorCode.DATA_ENTRY_ERROR,
        message: 'The data entered already exists in the system.',
        extra: { invalidFields: expectedInvalidFields },
      },
    });
  });

  it.each([
    [
      'username is missing', 
      {
        otherValue: 'test.example',
        email: 'test@example.com',
        displayName: 'Test Example',
        password: 'password-example',
      }, 
      ['username: string'],
    ],
    [
      'email is missing', 
      {
        otherValue: 'test@example.com',
        username: 'test.example',
        displayName: 'Test Example',
        password: 'password-example',
      }, 
      ['email: string'],
    ],
    [
      'displayName is missing', 
      {
        email: 'test@example.com',
        username: 'test.example',
        otherValue: 'Test Example',
        password: 'password-example',
      }, 
      ['displayName: string'],
    ],
    [
      'password is missing', 
      {
        email: 'test@example.com',
        username: 'test.example',
        displayName: 'Test Example',
        otherValue: 'password-example',
      }, 
      ['password: string'],
    ],
  ])('should return an error when the required %s', async (
    _msg: string, 
    payload: Record<string, any>, 
    expectedInvalidFields: string[],
  ) => {
    const response = await request(app)
      .post(URL_ENDPOINT)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({  
      status: false,
      error: {
        code: ErrorCode.EMPTY_DATA_ERROR,
        message: 'Required fields are missing from the request body.',
        extra: { invalidFields: expectedInvalidFields },
      },
    });
  });

  it(
    'should return an error when creating a user results in an unexpected error', 
    async () => {
      prismaMock.user.create.mockRejectedValue(
        new Error('Unexpected failure')
      );

      const response = await request(app)
        .post(URL_ENDPOINT)
        .send({
          username: 'test.example',
          email: 'test@example.com',
          displayName: 'Test Example',
          password: 'password-example',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ 
        status: false,
        error: {
          code: ErrorCode.NOT_FOUND_ERROR,
          message: 'Resource not found.',
        },
      });
    }
  );

  it('should return an error when fields is other data type', async () => {
    // types: number, booolean, json
    const response = await request(app)
        .post(URL_ENDPOINT)
        .send({
          username: 12345,
          email: 12345,
          displayName: 12345,
          password: 12345,
        });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({  
      status: false,
      error: {
        code: ErrorCode.EMPTY_DATA_ERROR,
        message: 'Required fields are missing from the request body.',
        extra: { invalidFields: [
          'username: string', 
          'email: string',
          'displayName: string',
          'password: string'
        ]},
      },
    });
  });
});
 