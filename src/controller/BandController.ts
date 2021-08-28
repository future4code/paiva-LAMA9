import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { BandDetailDTO, BandInputDTO } from "../model/Band";
import { BandBusiness } from "../business/BandBusiness";

export class BandController {
  constructor(private bandBusiness: BandBusiness) {}
  async create(req: Request, res: Response) {
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

  async getDetail(req: Request, res: Response) {
    try {
      const detailData: BandDetailDTO = {
        id: req.query.id as string,
        name: req.query.name as string,
      };

      const bandDetails = await this.bandBusiness.getBandByParam(detailData);

      res.status(200).send({ bandDetails });
    } catch (error) {
            if (error.code) {
              res.status(error.code).send({ message: error.message });
            } else {
              res.status(400).send({ message: error.message });
            }
    }

    await BaseDatabase.destroyConnection();
  }
}
