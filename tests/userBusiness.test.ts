import { convertToObject } from "typescript";
import { UserBusiness } from "../src/business/UserBusiness";
import { UserDatabase } from "../src/data/UserDatabase";
import { UserInputDTO } from "../src/model/User";
import { Authenticator } from "../src/services/Authenticator";
import { HashManager } from "../src/services/HashManager";
import { IdGenerator } from "../src/services/IdGenerator";
import { mockUserDatabase } from "./mockData";
import {
  mockAuthenticator,
  mockHashManager,
  mockIdGenerator,
} from "./mockServices";

const userBusiness = new UserBusiness(
  mockUserDatabase as unknown as UserDatabase,
  mockIdGenerator as unknown as IdGenerator,
  mockHashManager as unknown as HashManager,
  mockAuthenticator as unknown as Authenticator
);

describe("signup test", () => {
  test("Error when e-mail is not valid", async () => {
    expect.assertions(1);
    const user = {
      name: "wrong",
      email: "forgotat.com",
      password: "123toostronk",
      role: "ADMIN",
    } as UserInputDTO;

    try {
      await userBusiness.createUser(user);
    } catch (error) {
      expect(error.message).toBe(
        "Name, password, a valid e-mail and role  must be provided to signup"
      );
    }
  });
  test("Error when role is not valid", async () => {
    expect.assertions(1);
    const user = {
      name: "wrong",
      email: "email@gmail.com",
      password: "123toostronk",
      role: "MASTER",
    } as UserInputDTO;

    try {
      await userBusiness.createUser(user);
    } catch (error) {
      expect(error.message).toBe(
        "Name, password, a valid e-mail and role  must be provided to signup"
      );
    }
  });
  test("Error when email is already used", async () => {
    expect.assertions(2);
    const user = {
      name: "wrong",
      email: "valid@gmail.com",
      password: "123toostronk",
      role: "ADMIN",
    } as UserInputDTO;

    try {
      await userBusiness.createUser(user);
    } catch (error) {
      expect(error.message).toBe("User already exists");
      expect(error.code).toBe(401);
    }
  });
});
