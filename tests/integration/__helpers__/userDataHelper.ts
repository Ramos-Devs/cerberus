import { UserType } from "../../../src/consts/enums";
import { prismaMock } from "../__mocks__/dbMock";

export const userDefaultHelper = async () => {
  const resulUser = {
    id: 'uuid-1',
    username: 'username-example',
    email: 'example@test.com',
    displayName: 'Test User',
    password: 'password-example',
    userType: UserType.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  prismaMock.user.create.mockResolvedValue(resulUser);

  return resulUser;
};