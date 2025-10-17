import request from 'supertest';
import app from '../../../src/app';

const URL_ENDPOINT = '/auth/authenticate-user';

describe('Successful user authentication', () => {
  it('should return user data when credentials are valid', async () => {
    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({ 
        user: 'test@example.com',
        password: 'pass-example',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Success' });
  });
});

describe('Failed user authentication', () => {
  it('should return an error when the requets body is empty', async () => {
    const response = await request(app)
      .post(URL_ENDPOINT);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Error' });
  });

  test.each([
    ['password is missing', { user: 'test@example.com' }],
    ['user is missing', { password: 'pass-example' }],
  ])('should return an error when the required %s', async (_msg: string, body: Record<string, any>) => {
    const response = await request(app)
      .post(URL_ENDPOINT)
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Error' });
  });
});
