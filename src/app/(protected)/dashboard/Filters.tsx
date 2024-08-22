'use client';

import { useId, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FilterIcon, CheckIcon, Check, ChevronDown } from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';

const filterableFields = [
  'plant', // admin only cbb
  'machine', // admin only cbb

  'date', // date
  'shift', // toggle group

  'items', // cmd
  'customer', // cmd
  'dieCode', // cmd
  'cavity', // cmd
  'lotNo',
  'yield',
  'ok',
  'remark',
];

export default function Filters() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 ml-2">
          <FilterIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Filter
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" avoidCollisions>
        <div className="grid grid-cols-[min-content_1fr] gap-6 items-center">
          <PlantFilter />
        </div>
      </PopoverContent>
    </Popover>
  );
}

const fakeItems = [
  'AL FORM',
  'AFHR00007T',
  'CWWES00019',
  'T471153003',
  'H461759502',
];

function PlantFilter() {
  return (
    <>
      <Label>Plant</Label>
      <SuggestedInput placeholder="Select plant..." />
    </>
  );
}

function SuggestedInput({
  list = fakeItems,
  placeholder = '',
}: {
  list?: string[];
  placeholder?: string;
}) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-60 justify-between"
        >
          {value || <span className="opacity-50">{placeholder}</span>}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => {
                    setValue(item);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
