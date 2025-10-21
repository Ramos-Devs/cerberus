import { UserType } from "../../../src/constants/enums";
import { convertHashPassword } from "../../../src/utils/bcryptsPassword";
import { prismaMock } from "../__mocks__/dbMock";

export const userDefaultHelper = async () => {

  const password ='password-example';

  const userData = {
    id: 'uuid-1',
    username: 'username-example',
    email: 'example@test.com',
    displayName: 'Test User',
    password:  await convertHashPassword(password),
    userType: UserType.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  prismaMock.user.create.mockResolvedValue(userData);

  return {userData, password};
};