import jwt from 'jsonwebtoken';
import { generateToken } from '../../../src/utils/jwt';
import config from '../../../src/config';
import { UserType } from '../../../src/constants/enums';

test('generateToken should return a valid JWT token string', () => {
  const payload = {
    id: '123',
    userType: UserType.USER,
  };

  const token = generateToken(payload);

  const decoded = jwt.verify(token, config.jwtSecret);

  expect(decoded).toMatchObject(payload);
});
