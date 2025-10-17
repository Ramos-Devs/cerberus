import request from 'supertest';
import app from '../../../src/app';

describe('Successful user authentication', () => {
  it('should return a success message for valid credentils', async () => {
    const URL_ENDPOINT = '/auth/authenticate-user';

    const response = await request(app).post(URL_ENDPOINT);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Success' });
  });
});
