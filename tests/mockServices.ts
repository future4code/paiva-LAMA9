import { User } from "../src/model/User";

export const mockAuthenticator = {
  generateToken: jest.fn(async (user: User) => {}),
  getData: jest.fn((token: string) => {
    switch (token) {
      case "user":
        return { id: "id", role: "NORMAL" };
      case "admin":
        return { id: "id", role: "ADMIN" };
      default:
        return undefined;
    }
  }),
};

export const mockIdGenerator = {
  generate: jest.fn(() => {
    "Id";
  }),
};

export const mockHashManager = {
  hash: jest.fn(async (something: string) => {
    "123";
  }),

  compare: jest.fn(async (text: string, hash: string) => {
    if (text === "true") {
      return true;
    } else {
      return false;
    }
  }),
};
