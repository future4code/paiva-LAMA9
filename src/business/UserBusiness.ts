import { UserInputDTO, LoginInputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { BaseError } from "../error/BaseError";
import { EMAIL_REGEX } from "../model/constants";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private hashManager: HashManager,
    private authenticator: Authenticator
  ) {}

  async createUser(user: UserInputDTO) {
    const emailValidation = EMAIL_REGEX.test(user.email);

    if (
      !user.name ||
      !user.password ||
      !emailValidation ||
      user.role !== ("ADMIN" || "NORMAL")
    ) {
      throw new Error(
        "Name, password, a valid e-mail and role  must be provided to signup"
      );
    }

    const userExists = await this.userDatabase.getUserByEmail(user.email);
    if (userExists.getId()) {
      throw new BaseError("User already exists", 401);
    }
    const id = this.idGenerator.generate();

    const hashPassword = await this.hashManager.hash(user.password);

    await this.userDatabase.createUser(
      id,
      user.email,
      user.name,
      hashPassword,
      user.role
    );

    const accessToken = this.authenticator.generateToken({
      id,
      role: user.role,
    });

    return accessToken;
  }

  async getUserByEmail(user: LoginInputDTO) {
    if (!user.email || !user.password) {
      throw new Error("Invalid e-mail or password");
    }
    const userFromDB = await this.userDatabase.getUserByEmail(user.email);

    const hashCompare = await this.hashManager.compare(
      user.password,
      userFromDB.getPassword()
    );

    if (!hashCompare) {
      throw new Error("Invalid e-mail or password");
    }
    const accessToken = this.authenticator.generateToken({
      id: userFromDB.getId(),
      role: userFromDB.getRole(),
    });

    return accessToken;
  }
}
