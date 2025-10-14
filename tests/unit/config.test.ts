import { getRequiredEnv } from "../../src/config";

describe("Environment variable validation", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should throw an error if the environment variable is missing", () => {
    process.env = {};

    const ENV_NOT_EXIST = "ENV_NOT_EXIST";

    expect(() => getRequiredEnv(ENV_NOT_EXIST))
      .toThrow(`Missing required environment variable: ${ENV_NOT_EXIST}`);
  });

  it("should return the value if the environment variable exists", () => {
    const EXIST_ENV = "exist-env";

    process.env['EXIST_ENV'] = EXIST_ENV;

    const result = getRequiredEnv("EXIST_ENV");
    expect(result).toBe(EXIST_ENV);
  });
});
