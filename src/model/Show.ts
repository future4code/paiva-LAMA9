export class Show {
  constructor(
    private id: string,
    private weekDay: DAYS,
    private startTime: number,
    private endTime: number,
    private bandId: string
  ) {}

  getId() {
    return this.id;
  }

  getWeekDay() {
    return this.weekDay;
  }

  getStartTime() {
    return this.startTime;
  }
  getEndTime() {
    return this.endTime;
  }
  getBandId() {
    return this.bandId;
  }

  static toShowModel(show: any): Show {
    return new Show(
      show.id,
      Show.stringToWeekModel(show.weekDay),
      show.startTime,
      show.endTime,
      show.bandId
    );
  }
  static stringToWeekModel(input: string): DAYS {
    switch (input) {
      case "friday":
        return DAYS.friday;
      case "saturday":
        return DAYS.saturday;
      case "sunday":
        return DAYS.sunday;
      default:
        throw new Error("Invalid weekDay");
    }
  }
}

export interface ShowInputDTO {
  weekDay: string;
  bandId: string;
  startTime: string;
  endTime: string;
  accessToken: string;
}

export enum DAYS {
  friday = "friday",
  saturday = "saturday",
  sunday = "sunday",
}
export interface ShowDatabaseDTO {
  weekDay: DAYS;
  bandId: string;
  startTime: number;
  endTime: number;
}
