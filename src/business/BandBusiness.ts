import { BandInputDTO } from "../model/Band";
import { BandDatabase } from "../data/BandDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { BaseError } from "../error/BaseError";
import { UserRole } from "../model/User";

export class BandBusiness {
  constructor(
    private BandDatabase: BandDatabase,
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

    const BandExists = await this.BandDatabase.getBandByParam(band.name);
    if (BandExists.getId()) {
      throw new BaseError("Band already exists", 401);
    }
    const id = this.idGenerator.generate();

    await this.BandDatabase.createBand(
      id,
      band.name,
      band.musicGenre,
      band.responsible
    );
  }

  // async getBandByEmail(band: BandInputDTO) {
  //   if (!band.email || !band.password) {
  //     throw new Error("Invalid e-mail or password");
  //   }
  //   const BandFromDB = await this.BandDatabase.getBandByEmail(Band.email);

  //   const hashCompare = await this.hashManager.compare(
  //     Band.password,
  //     BandFromDB.getPassword()
  //   );

  //   if (!hashCompare) {
  //     throw new Error("Invalid e-mail or password");
  //   }
  //   const accessToken = this.authenticator.generateToken({
  //     id: BandFromDB.getId(),
  //     role: BandFromDB.getRole(),
  //   });

  //   return accessToken;
  // }
}
