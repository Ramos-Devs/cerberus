import request from 'supertest';
import app from '../../../src/app';

const URL_ENDPOINT = '/auth/register-user';

describe('User registration successful', () => {
  it('should return data when a user registers', async () => {
    const payloadUserData = {
      username: 'test.example',
      email: 'test@example.com',
      displayName: 'Test Example',
      password: 'password-example',
      userType: 'user',
    }

    const response = await request(app)
      .post(URL_ENDPOINT)
      .send(payloadUserData);

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
});

