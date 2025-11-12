import { UserType } from "../../../src/constants/enums";
import { createNewUser, getUserByIdentifier } from "../../../src/models/userModel";
import { userDefaultHelper } from "../../integration/__helpers__/userDataHelper";
import { prismaMock } from "../../integration/__mocks__/dbMock";

test.each([
  ['username', 'username-example'],
  ['email', 'example@test.com'],
])('getUserByIdentifier should return user data when using %s', async (
  _field,
  identifier,
) => {
  const { userData } = await userDefaultHelper();
  
  prismaMock.user.findFirstOrThrow.mockResolvedValue(userData);

  const result = await getUserByIdentifier(identifier);

  expect(result).toEqual(userData);
});

test('createNewUser should create a new user successfully', async () => {
  const newUser = {
    username: 'new_user',
    email: 'new_user@test.com',
    displayName: 'New User',
    password: 'new-password',
    userType: UserType.USER,
  };
  
  const createdUser = {
    id: '2',
    ...newUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  prismaMock.user.create.mockResolvedValue(createdUser);

  const result = await createNewUser(newUser);

  expect(result).toEqual(createdUser);
});
