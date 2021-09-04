import { DAYS, Show, ShowDatabaseDTO } from "../model/Show";
import { BaseDatabase } from "./BaseDatabase";

export class ShowDatabase extends BaseDatabase {
  private static TABLE_NAME = "NOME_TABELA_SHOWS";

  public async create(
    id: string,
    week_day: string,
    start_time: number,
    end_time: number,
    band_id: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          week_day,
          start_time,
          end_time,
          band_id,
        })
        .into(ShowDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getShows(input: ShowDatabaseDTO): Promise<Show[]> {
    const result = await this.getConnection()
      .select("*")
      .from(ShowDatabase.TABLE_NAME)
      .where({ week_day: input.weekDay })
      .andWhere("start_time", "<=", input.endTime)
      .andWhere("end_time", ">=", input.startTime)
      .orderBy("start_time", "asc");

    return result.map((show) => {
      return Show.toShowModel(show);
    });
  }
}
