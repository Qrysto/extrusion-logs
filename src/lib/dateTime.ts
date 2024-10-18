import { format, parse } from 'date-fns';
// import { vi } from 'date-fns/locale/vi';
import type { DateRange } from './types';

export const displayDateFormat = 'PP';
// vi = 'EEEEE P'
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
