import express from "express";
import { UserBusiness } from "../business/UserBusiness";
import { UserController } from "../controller/UserController";
import { UserDatabase } from "../data/UserDatabase";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";

export const userRouter = express.Router();

const userDatabase = new UserDatabase();
const idGenerator = new IdGenerator();
const hashManager = new HashManager();
const authenticator = new Authenticator();

const userBusiness = new UserBusiness(
  userDatabase,
  idGenerator,
  hashManager,
  authenticator
);
const userController = new UserController(userBusiness);

userRouter.post("/signup", (req, res) => userController.signup(req, res));
userRouter.post("/login", (req, res) => userController.login(req, res));
