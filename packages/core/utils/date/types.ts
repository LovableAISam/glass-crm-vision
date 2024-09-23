
export interface MonthDayYear {
  month: number;
  day: number;
  year: number;
}

export interface HourMinuteSecond {
  hour: number;
  minute: number;
  second: number;
}

export interface SpecificDate {
  monthDayYear: MonthDayYear;
  hourMinuteSecond: HourMinuteSecond;
}

export type DatePeriod = {
  startDate: Date | null;
  endDate: Date | null;
}