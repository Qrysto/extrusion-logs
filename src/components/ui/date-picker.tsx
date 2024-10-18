'use client';

import { useState, ComponentProps } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTranslate } from '@/lib/intl/client';
import { formatDate, parseDate, displayDateFormat } from '@/lib/dateTime';

export function DatePicker({
  date,
  onDateChange,
  className,
  ...rest
}: {
  date: string | null;
  onDateChange: (date: string | null) => void;
} & ComponentProps<typeof Button>) {
  const __ = useTranslate();
  const [open, setOpen] = useState(false);
  const parsedDate = parseDate(date);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          {...rest}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            displayDate(parsedDate)
          ) : (
            <span className="opacity-50">{__('Pick a date')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={parsedDate || undefined}
          onSelect={(selected) => {
            onDateChange(formatDate(selected || null));
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function displayDate(date: Date | null) {
  if (!date) return null;
  return format(date, displayDateFormat);
}
