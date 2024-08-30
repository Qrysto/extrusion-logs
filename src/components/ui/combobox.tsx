'use client';

import { useState, useMemo, ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, CircleX } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface ComboboxProps extends Omit<ComponentProps<typeof Button>, 'value'> {
  list?: ComboboxListItem[];
  placeholder?: string;
  value: string | null;
  onValueChange: (value: string | null) => void;
}

export function Combobox({
  list = fakeItems,
  placeholder = '',
  value,
  onValueChange,
  className,
  ...rest
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const item = useMemo(
    () => list?.find((item) => String(getValue(item)) === value),
    [list, value]
  );
  const label = item && getLabel(item);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-52 justify-between', className)}
          {...rest}
        >
          {label || <span className="opacity-50">{placeholder}</span>}
          <span className="flex items-center">
            {!!value && (
              <CircleX
                className="h-4 w-4 opacity-50 hover:opacity-75 cursor-pointer"
                onClick={(evt) => {
                  evt.stopPropagation();
                  onValueChange(null);
                }}
              />
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {list.map((item) => {
                const valueStr = String(getValue(item));
                return (
                  <CommandItem
                    key={valueStr}
                    value={valueStr}
                    onSelect={() => {
                      if (value !== valueStr) {
                        onValueChange(valueStr);
                      } else {
                        onValueChange(null);
                      }
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === valueStr ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {getLabel(item)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function getValue(item: ComboboxListItem) {
  if (typeof item === 'string') {
    return item;
  } else {
    return item.value;
  }
}

function getLabel(item: ComboboxListItem) {
  if (typeof item === 'string') {
    return item;
  } else {
    return item.label;
  }
}

export type ComboboxListItem =
  | {
      value: string | number;
      label: string;
    }
  | string;

const fakeItems = [
  { value: 1, label: 'AL FORM' },
  { value: 2, label: 'AFHR00007T' },
  { value: 3, label: 'CWWES00019' },
  { value: 4, label: 'T471153003' },
  { value: 5, label: 'H461759502' },
];
