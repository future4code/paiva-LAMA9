import express from "express";
import { ShowBusiness } from "../business/ShowBusiness";
import { ShowController } from "../controller/ShowController";
import { ShowDatabase } from "../data/ShowDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export const showRouter = express.Router();

const showDatabase = new ShowDatabase();
const idGenerator = new IdGenerator();
const authenticator = new Authenticator();

const showBusiness = new ShowBusiness(showDatabase, idGenerator, authenticator);
const showController = new ShowController(showBusiness);

showRouter.post("/create", showController.create);
// showRouter.post("/search", showController.search;
