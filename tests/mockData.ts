import { BaseError } from "../src/error/BaseError";
import { User, UserRole } from "../src/model/User";

export const mockUserDatabase = {
  createUser: jest.fn(
    (
      id: string,
      email: string,
      name: string,
      password: string,
      role: string
    ) => {}
  ),
  getUserByEmail: jest.fn(async (email: string) => {
    if (email === "valid@gmail.com") {
      return User.toUserModel({
        id: "id",
        name: "name",
        email: "valid@gmail.com",
        password: "password",
        role: "ADMIN",
      });
    } else {
      throw new BaseError("Invalid signature", 400);
    }
  }),
};
