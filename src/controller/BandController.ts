import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { BandInputDTO } from "../model/Band";
import { BandBusiness } from "../business/BandBusiness";

export class BandController {
  constructor(private bandBusiness: BandBusiness) {}
  async createBand(req: Request, res: Response) {
    try {
      const input: BandInputDTO = {
        name: req.body.name,
        musicGenre: req.body.musicGenre,
        responsible: req.body.responsible,
        accessToken: req.headers.authorization as string,
      };

      await this.bandBusiness.createBand(input);

      res.status(201).end();
    } catch (error) {
      if (error.code) {
        res.status(error.code).send({ message: error.message });
      } else {
        res.status(400).send({ message: error.message });
      }
    }

    await BaseDatabase.destroyConnection();
  }

  // async login(req: Request, res: Response) {
  //   try {
  //     const loginData: LoginInputDTO = {
  //       email: req.body.email,
  //       password: req.body.password,
  //     };

  //     const token = await this.userBusiness.getUserByEmail(loginData);

  //     res.status(200).send({ token });
  //   } catch (error) {
  //           if (error.code) {
  //             res.status(error.code).send({ message: error.message });
  //           } else {
  //             res.status(400).send({ message: error.message });
  //           }
  //   }

  //   await BaseDatabase.destroyConnection();
  // }
}
