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
      data: { displayName: userData.displayName }
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
          'password: string'
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
          'password: string'
        ]},
      },
    });
  });

  it('should return an error when unique fields already exist', async () => {
    const prismaError = new PrismaClientKnownRequestError(
      'Unique constraint failed on the fields: (`username`)',
      {
        code: 'P2002',
        clientVersion: '6.17.1',
        meta: { modelName: 'User', target: ['username'] },
      }
    ); // TODO: Automatizar para los campos unicos en el modelo (username, email)

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
    expect(response.body).toEqual({ message: 'Error' });
  });

  it('should return an error when the required fields is missing', async () => {
    // ?Fields
    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({ 
        username: 'test.example',
        otherValue: 'value-example',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({  
      status: false,
      error: {
        code: ErrorCode.EMPTY_DATA_ERROR,
        message: 'Required fields are missing from the request body.',
        extra: { invalidFields: [
          'email: string',
          'displayName: string',
          'password: string'
        ]},
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
      expect(response.body).toEqual({ message: 'Error' });
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
 