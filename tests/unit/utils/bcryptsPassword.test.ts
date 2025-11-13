import { convertHashPassword, isPasswordMatch } from "../../../src/utils/bcryptsPassword";

const password = 'original-password';

test(
  'convertHashPassword should return a encrypted password derived original password', 
  async () => {  
    const hashedPassword = await convertHashPassword(password);
    expect(hashedPassword).not.toBe(password);
  }
)

test('isPasswordMatch should return true when password matches hash', async () => {
  const hashedPassword = await convertHashPassword(password);
  const isMatch = await isPasswordMatch(password, hashedPassword);
  expect(isMatch).toBe(true)
})

test.each([
  [
    'different password', 
    'other-password', 
    async (password: string) => await convertHashPassword(password),
  ],
  [
    'different hash', 
    password, 
    async (_: string) => 'other-hash'
  ],
])('isPasswordMatch should return false when %s', async (_case, passwordResult, getHash) => {
  const hashedPassword = await getHash(password);
  const isMatch = await isPasswordMatch(passwordResult, hashedPassword);
  expect(isMatch).toBe(false);
});

