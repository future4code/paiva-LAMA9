import { BandDetailDTO, BandInputDTO } from "../model/Band";
import { BandDatabase } from "../data/BandDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { BaseError } from "../error/BaseError";
import { UserRole } from "../model/User";

export class BandBusiness {
  constructor(
    private bandDatabase: BandDatabase,
    private idGenerator: IdGenerator,
    private authenticator: Authenticator
  ) {}

  async createBand(band: BandInputDTO) {
    const token = this.authenticator.getData(band.accessToken);
    if (token.role !== UserRole.ADMIN) {
      throw new BaseError(
        "Invalid signature, only ADMINS can add new bands",
        401
      );
    }

    if (!band.name || !band.musicGenre || !band.responsible) {
      throw new Error(
        "Band name, music genre, and one person as responsible must be provided to register a new band"
      );
    }

    const BandExists = await this.bandDatabase.getBandByParam(band.name);
    if (BandExists.getId()) {
      throw new BaseError("Band already exists", 401);
    }
    const id = this.idGenerator.generate();

    await this.bandDatabase.createBand(
      id,
      band.name,
      band.musicGenre,
      band.responsible
    );
  }

  async getBandByParam(band: BandDetailDTO) {
    if (!band.id && !band.name) {
      throw new Error("Please provide id or band name");
    }

    let param = "";
    if (band.id) {
      param = band.id;
    } else {
      param = band.name;
    }

    const bandFromDB = await this.bandDatabase.getBandByParam(param);

    if (!bandFromDB.getId()) {
      throw new BaseError("Band not found", 404);
    }

    return bandFromDB;
  }
}
