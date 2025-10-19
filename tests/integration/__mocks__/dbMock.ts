import { mockDeep, mockReset } from 'jest-mock-extended';
import { PrismaClient } from '../../../generated/prisma';

export const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});

jest.mock('../../../src/db', () => ({
  __esModule: true,
  default: prismaMock,
}));