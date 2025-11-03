import { User } from '../../generated/prisma';
import prisma from '../db';

export const getUserByIdentifier = async (identifier: string): Promise<User> => {
  return prisma.user.findFirstOrThrow({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });
};

interface newUserData {
  username: string;
  email: string;
  displayName: string;
  password: string;
  userType: string;
}

export const createNewUser = async (data: newUserData): Promise<User> => {
  return prisma.user.create({ data: data });
};
