import { format, parse } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { ko } from 'date-fns/locale/ko';
import type { DateRange } from './types';

const enDisplayDateFormat = 'PP';
const viDisplayDateFormat = 'EEEEE P';
const koDisplayDateFormat = 'P (EEEEE)';

const enDisplayTimeFormat = 'PP HH:mm';
const viDisplayTimeFormat = 'EEEEE P HH:mm';
const koDisplayTimeFormat = 'P (EEEEE) HH:mm';

export function displayDate(
  date: Date | null,
  localeCode: 'vi' | 'kr' | 'en' = 'en'
) {
  if (!date) return null;
  const locale =
    localeCode === 'vi' ? vi : localeCode === 'kr' ? ko : undefined;
  const displayDateFormat =
    localeCode === 'vi'
      ? viDisplayDateFormat
      : localeCode === 'kr'
      ? koDisplayDateFormat
      : enDisplayDateFormat;
  return format(date, displayDateFormat, { locale });
}

export function displayTime(
  date: Date | null,
  localeCode: 'vi' | 'kr' | 'en' = 'en'
) {
  if (!date) return null;
  const locale =
    localeCode === 'vi' ? vi : localeCode === 'kr' ? ko : undefined;
  const displayTimeFormat =
    localeCode === 'vi'
      ? viDisplayTimeFormat
      : localeCode === 'kr'
      ? koDisplayTimeFormat
      : enDisplayTimeFormat;
  return format(date, displayTimeFormat, { locale });
}

export const standardDateFormat = 'yyyy-MM-dd';

export const referenceDate = new Date();

export const timeFormat = 'HH:mm';

export function formatDateRange(
  dateRange: DateRange | null,
  dateFormat: string = standardDateFormat
) {
  if (!dateRange) return null;
  try {
    return `${format(dateRange.from, dateFormat)} - ${format(
      dateRange.to,
      dateFormat
    )}`;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function displayDateRange(
  dateRange: DateRange | null,
  localeCode: 'vi' | 'kr' | 'en' = 'en'
) {
  if (!dateRange) return null;
  try {
    return `${displayDate(dateRange.from, localeCode)} - ${displayDate(
      dateRange.to,
      localeCode
    )}`;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function parseDateRange(
  dateRangeStr: string | null,
  dateFormat: string = standardDateFormat
) {
  if (!dateRangeStr) return null;
  try {
    const [fromStr, toStr] = dateRangeStr.split(' - ');
    const from = parse(fromStr, dateFormat, referenceDate);
    const to = parse(toStr, dateFormat, referenceDate);
    return { from, to };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function formatDate(
  date: Date | null,
  dateFormat: string = standardDateFormat
) {
  if (!date) return null;
  try {
    return format(date, dateFormat);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function parseDate(
  dateStr: string | null,
  dateFormat: string = standardDateFormat
) {
  if (!dateStr) return null;
  try {
    const date = parse(dateStr, dateFormat, referenceDate);
    return date;
  } catch (err) {
    console.error(err);
    return null;
  }
}
