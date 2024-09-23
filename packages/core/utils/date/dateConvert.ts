import { DATE_FORMAT, TIME_FORMAT } from './constants';
import { isValid } from 'date-fns';
import { utcToZonedTime, format } from 'date-fns-tz';
import { MonthDayYear, HourMinuteSecond, SpecificDate } from './types';

export function parseMDYToDate(date: MonthDayYear): Date {
  const { month, day, year } = date;

  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function parseHMSToDate(time: HourMinuteSecond): Date {
  const { hour, minute, second } = time;

  return new Date(0, 0, 0, Number(hour), Number(minute), Number(second));
}

export function parseSpecificDateToDate(date: SpecificDate): Date {
  const { month, day, year } = date.monthDayYear;
  const { hour, minute, second } = date.hourMinuteSecond;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
}

export const stringToDateFormat = (dateStr?: string | null | Date, dateFormat: string = DATE_FORMAT) => {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (isValid(date)) {
    const date = new Date(dateStr);
    const gmtPlus8Date = utcToZonedTime(date, 'Asia/Shanghai');
    const formattedDate = format(gmtPlus8Date, dateFormat);
    return formattedDate;
  } else {
    return '';
  }

};

export const getDateTimeFromString = (dateStart?: string | null, dateEnd?: string | null) => {
  if (!dateStart || !dateEnd) return null;

  return `${format(new Date(dateStart), DATE_FORMAT)} ${format(new Date(dateEnd), TIME_FORMAT)}`;
};

export const getDateTimeFromDate = (dateStart?: Date | null, dateEnd?: Date | null) => {
  if (!dateStart || !dateEnd) return null;

  return `${format(dateStart, DATE_FORMAT)} ${format(dateEnd, TIME_FORMAT)}`;
};

export const convertUTCFormatToLocalDateTime = (dateStr?: string | null) => {
  if (!dateStr) return null;

  const date = dateStr.replace(/Z/g, '');
  return new Date(date).toUTCString().slice(0, -4);
};

export function calculateDateRangeDays(
  startDate: Date | null,
  endDate: Date | null,
): number {
  const startDateObj = new Date(startDate || '');
  const endDateObj = new Date(endDate || '');
  const timeDiff = endDateObj.getTime() - startDateObj.getTime();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  return Math.abs(Math.floor(daysDiff));
}

export default {
  parseMDYToDate,
  parseHMSToDate,
  parseSpecificDateToDate,
  stringToDateFormat,
  getDateTimeFromString,
  getDateTimeFromDate,
  convertUTCFormatToLocalDateTime,
  calculateDateRangeDays
};
