'use client';

import { Table } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ListChecks } from 'lucide-react';

export default function ColumnSelector<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-1">
          <ListChecks className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Columns
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[200px] overflow-auto max-h-96"
        avoidCollisions
      >
        {table
          ?.getAllLeafColumns()
          .filter((col) => col.getCanHide())
          .map((column, i) => (
            <DropdownMenuCheckboxItem
              key={column.id || i}
              className="cursor-pointer"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {columnLabels[column.id]}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columnLabels: Record<string, string> = {
  date: 'Date',
  shift: 'Shift',
  plant: 'Plant',
  machine: 'Machine',
  inch: 'Inch',
  employeeId: 'Employee ID',

  item: 'Item',
  customer: 'Customer',
  dieCode: 'Die code',

  dieNumber: 'Die number',
  cavity: 'Cavity',
  productKgpm: 'Product kg/m',

  billetType: 'Billet type',
  billetKgpm: 'Billet kg/m',
  billetLength: 'Billet length',
  billetQuantity: 'Billet quantity',
  billetWeight: 'Billet weight',
  ingotRatio: 'Ingot ratio',
  lotNumberCode: 'Lot number',

  ramSpeed: 'Ram speed',
  billetTemp: 'Billet temp.',
  outputTemp: 'Output temp.',
  orderLength: 'Order length',
  outputRate: 'Output rate (kg/h)',
  productionQuantity: 'Production quantity',
  productionWeight: 'Production weight',

  ok: 'OK/NG',
  outputYield: 'Yield',
  ngQuantity: 'NG Quantity',
  ngWeight: 'NG Weight',
  ngPercentage: 'NG Percentage',
  remark: 'Remark',
  buttWeight: 'Butt weight',
  code: 'Code',
  startTime: 'Start',
  endTime: 'Finish',
  workingTime: 'Working time',
};
