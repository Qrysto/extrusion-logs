'use client';

import { format, parse } from 'date-fns';
// import { vi } from 'date-fns/locale/vi';
import { Calendar as CalendarIcon, CircleX } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const dateFormat = 'PP';
// vi = 'EEEEE P'

export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  dateRange: DateRange | null;
  onDateRangeChange: (dateRange: DateRange | null) => void;
}) {
  const dateRangeStr = formatDateRange(dateRange);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-72 justify-between text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <span className="flex items-center">
              <CalendarIcon
                className={cn('mr-2 h-4 w-4', { 'opacity-50': !dateRange })}
              />
              {dateRangeStr || (
                <span className="opacity-50">Pick a date range</span>
              )}
            </span>
            {!!dateRange && (
              <CircleX
                className=" h-4 w-4 opacity-50 hover:opacity-75 cursor-pointer"
                onClick={(evt) => {
                  evt.stopPropagation();
                  onDateRangeChange(null);
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={referenceDate}
            selected={dateRange || undefined}
            onSelect={(selected) => {
              if (selected) {
                const { from, to } = selected;
                if (from && to) {
                  onDateRangeChange({ from, to });
                } else if (from && !to) {
                  onDateRangeChange({ from, to: from });
                } else if (!from && to) {
                  onDateRangeChange({ from: to, to });
                }
              } else {
                onDateRangeChange(null);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function formatDateRange(dateRange: DateRange | null) {
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

export function parseDateRange(dateRangeStr: string | null) {
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

const referenceDate = new Date();

export type DateRange = {
  from: Date;
  to: Date;
};
