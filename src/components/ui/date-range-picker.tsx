'use client';

import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const dateFormat = 'dd/MM/y';

export function DateRangePicker({
  className,
  dateRangeStr,
  onDateRangeChange,
}: React.HTMLAttributes<HTMLDivElement> & {
  dateRangeStr: string | undefined;
  onDateRangeChange: (dateRange?: string) => void;
}) {
  const dateRange = parseDateRange(dateRangeStr);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-60 justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon
              className={cn('mr-2 h-4 w-4', { 'opacity-50': !dateRangeStr })}
            />
            {dateRangeStr || <span className="opacity-50">Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={referenceDate}
            selected={dateRange}
            onSelect={(selected) => {
              if (selected && selected.from && selected.to) {
                const { from, to } = selected;
                onDateRangeChange(formatDateRange({ from, to }));
              } else {
                onDateRangeChange(undefined);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function formatDateRange(dateRange: DateRange | undefined) {
  if (!dateRange) return undefined;
  return `${format(dateRange.from, dateFormat)} - ${format(
    dateRange.to,
    dateFormat
  )}`;
}

function parseDateRange(dateRangeStr: string | undefined) {
  if (!dateRangeStr) return undefined;
  try {
    const [fromStr, toStr] = dateRangeStr.split(' - ');
    const from = parse(fromStr, dateFormat, referenceDate);
    const to = parse(toStr, dateFormat, referenceDate);
    return { from, to };
  } catch (err) {
    return undefined;
  }
}

const referenceDate = new Date();

export type DateRange = {
  from: Date;
  to: Date;
};
