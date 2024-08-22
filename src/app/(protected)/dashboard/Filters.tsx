'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FilterIcon, CheckIcon, Check, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { useUpdateSearchParams } from '@/lib/clientUtils';
import { Calendar } from '@/components/ui/calendar';
import { Combobox } from '@/components/ui/combobox';

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
          <MachineFilter />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PlantFilter() {
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  return (
    <>
      <Label>Plant</Label>
      <Combobox
        placeholder="Select plant..."
        value={searchParams.get('plant')}
        onValueChange={(value) => updateSearchParams('plant', value)}
      />
    </>
  );
}

function MachineFilter() {
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  return (
    <>
      <Label>Plant</Label>
      <Combobox
        placeholder="Select machine..."
        value={searchParams.get('machine')}
        onValueChange={(value) => updateSearchParams('machine', value)}
      />
    </>
  );
}
