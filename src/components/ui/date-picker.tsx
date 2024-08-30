'use client';

import { useState, ComponentProps } from 'react';
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

export const dateFormat = 'PP';

export function DatePicker({
  date,
  onDateChange,
  className,
  ...rest
}: {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
} & ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);

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
            formatDate(date)
          ) : (
            <span className="opacity-50">Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(selected) => {
            onDateChange(selected || null);
            setOpen(false);
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function formatDate(date: Date | null) {
  if (!date) return null;
  return format(date, dateFormat);
}
