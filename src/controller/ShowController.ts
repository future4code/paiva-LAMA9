import { Request, Response } from "express";
import { ShowBusiness } from "../business/ShowBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { ShowInputDTO } from "../model/Show";

export class ShowController {
  constructor(private showBusiness: ShowBusiness) {}
  async create(req: Request, res: Response) {
    try {
      const input: ShowInputDTO = {
        bandId: req.body.bandId,
        weekDay: req.body.weekDay,
        startTime: req.body.musicGenre,
        endTime: req.body.endTime,
        accessToken: req.headers.authorization as string,
      };

      await this.showBusiness.create(input);

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

//   async getDetail(req: Request, res: Response) {
//     try {
//       const detailData: BandDetailDTO = {
//         id: req.query.id as string,
//         name: req.query.name as string,
//       };

//       const bandDetails = await this.bandBusiness.getBandByParam(detailData);

//       res.status(200).send({ bandDetails });
//     } catch (error) {
//       if (error.code) {
//         res.status(error.code).send({ message: error.message });
//       } else {
//         res.status(400).send({ message: error.message });
//       }
//     }

//     await BaseDatabase.destroyConnection();
//   }
}
