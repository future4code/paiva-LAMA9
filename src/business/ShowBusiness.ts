import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { BaseError } from "../error/BaseError";
import { UserRole } from "../model/User";
import { DAYS, Show, ShowDatabaseDTO, ShowDetailDTO, ShowInputDTO } from "../model/Show";
import { ShowDatabase } from "../data/ShowDatabase";

export class ShowBusiness {
  constructor(
    private showDatabase: ShowDatabase,
    private idGenerator: IdGenerator,
    private authenticator: Authenticator
  ) {}

  async create(show: ShowInputDTO) {
    const token = this.authenticator.getData(show.accessToken);
    if (token.role !== UserRole.ADMIN) {
      throw new BaseError(
        "Invalid signature, only ADMINS can add new shows",
        401
      );
    }

    if (!show.bandId || !show.startTime || !show.endTime || show.weekDay) {
      throw new Error(
        "BandId, startTime, endTime and weekDay must be provided to register a new show"
      );
    }
    const inputData: ShowDatabaseDTO = {
      bandId: show.bandId,
      startTime: Number(show.startTime),
      endTime: Number(show.endTime),
      weekDay: Show.stringToWeekModel(show.weekDay),
    };

    const showExists = await this.showDatabase.getShows(inputData);

    if (showExists.length > 0) {
      throw new BaseError(
        "There is another show at the time, please register at another day/time",
        401
      );
    }
    const id = this.idGenerator.generate();

    await this.showDatabase.create(
      id,
      inputData.weekDay,
      inputData.startTime,
      inputData.endTime,
      inputData.bandId
    );
  }

  async getShows(input:ShowDetailDTO) {
   const weekDay = Show.stringToWeekModel(input.weekDay)

    const inputDatabase: ShowDatabaseDTO = {
      bandId: "",
      startTime: 8,
      endTime: 23,
      weekDay,
    };
    return this.showDatabase.getShows(inputDatabase);
  }
}
