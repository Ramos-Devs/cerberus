import { User } from '../../generated/prisma';
import prisma from '../db';

export const getUserByIdentifier = async (identifier: string): Promise<User> => {
  return prisma.user.findFirstOrThrow({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });
};

export const createNewUser = async (
  username: string,
  email: string,
  displayName: string,
  password: string,
  userType: string
): Promise<User> => {
  return prisma.user.create({
    data: {
      username,
      email,
      displayName,
      password,
      userType,
    },
  });
};
