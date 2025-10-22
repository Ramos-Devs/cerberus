import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';

const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = Number(config.jwtExpiresIn);

export interface JwtPayload {
  id: string;
  userType: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };

  return jwt.sign(payload, JWT_SECRET as jwt.Secret, options);
};
