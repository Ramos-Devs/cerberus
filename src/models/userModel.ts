import { User } from '../../generated/prisma';
import prisma from '../db';

export const getUserByIdentifier = async (identifier: string): Promise<User> => {
  return prisma.user.findFirstOrThrow({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
    },
  });
};
