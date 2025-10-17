import request from 'supertest';
import app from '../../../src/app';

const URL_ENDPOINT = '/auth/authenticate-user';

describe('Successful user authentication', () => {
  it('should return user data when credentials are valid', async () => {
    const response = await request(app)
      .post(URL_ENDPOINT)
      .send({ value: 'value' });

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
  })
});
