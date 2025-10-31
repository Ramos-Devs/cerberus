import request from 'supertest';
import app from '../../../src/app';
import { prismaMock } from '../__mocks__/dbMock';
import { PrismaClientKnownRequestError } from '../../../generated/prisma/runtime/library';

const URL_ENDPOINT = '/auth/register-user';

describe('User registration successful', () => {
  it('should return data when a user registers', async () => {
    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({
        username: 'test.example',
        email: 'test@example.com',
        displayName: 'Test Example',
        password: 'password-example',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Success' });
  });
});

describe('User registration failed', () => {
  it('should return an error when the requets body is empty', async () => {
    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Error' });
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
      expect(response.body).toEqual({ message: 'Error' });
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
    expect(response.body).toEqual({ message: 'Error' });
  });

  it(
    'It should return an error when creating a user results in an unexpected error', 
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
      expect(response.body).toEqual({ message: 'Error' });
  });
});
 