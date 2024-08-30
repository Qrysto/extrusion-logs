'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ListChecks } from 'lucide-react';

const adminOnlyColumns = ['plant', 'createdBy'];

const columns = [
  'date',
  'shift',
  'employeeId',

  'item',
  'customer',
  'dieCode',

  'dieNumber',
  'cavity',
  'productKgpm',

  'billetType',
  'billetKgpm',
  'billetLength',
  'billetQuantity',
  'billetWeight',
  'ingotRatio',
  'lotNumberCode',

  'ramSpeed',
  'billetTemp',
  'outputTemp',
  'orderLength',
  'outputRate',
  'productionQuantity',
  'productionWeight',

  'ok',
  'outputYield',
  'ngPercentage',
  'ngQuantity',
  'ngWeight',
  'remark',
  'buttWeight',
  'code',
  'startTime',
  'endTime',
  'workingTime', // derived
];

const columnLabels: Record<string, string> = {
  date: 'Date',
  shift: 'Shift',
  plant: 'Plant',
  createdBy: 'Machine',
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

const storageKey = 'columns';

export default function ColumnSelector({ isAdmin }: { isAdmin: boolean }) {
  const { hiddenColumns, toggleColumn } = useHiddenColumns();
  const allColumns = [...(isAdmin ? adminOnlyColumns : []), ...columns];

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
        {allColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column}
            className="cursor-pointer"
            checked={!hiddenColumns.has(column)}
            onSelect={(evt) => {
              evt.preventDefault();
              toggleColumn(column);
            }}
          >
            {columnLabels[column]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function useHiddenColumns() {
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(() => {
    if (typeof localStorage === 'undefined') {
      return new Set();
    }

    const defaultJson = localStorage.getItem(storageKey);
    let defaultValue = [];
    try {
      defaultValue = defaultJson && JSON.parse(defaultJson);
    } catch (err) {}

    return new Set(defaultValue);
  });

  const updateValue = () => {
    const newValue = new Set(hiddenColumns);
    setHiddenColumns(newValue);
    localStorage.setItem(storageKey, JSON.stringify(Array.from(newValue)));
  };

  const hideColumn = (colName: string) => {
    hiddenColumns.add(colName);
    updateValue();
  };

  const unhideColumn = (colName: string) => {
    hiddenColumns.delete(colName);
    updateValue();
  };

  const toggleColumn = (colName: string) => {
    if (hiddenColumns.has(colName)) {
      unhideColumn(colName);
    } else {
      hideColumn(colName);
    }
  };

  return { hiddenColumns, hideColumn, unhideColumn, toggleColumn } as {
    hiddenColumns: ReadonlySet<string>;
    hideColumn: typeof hideColumn;
    unhideColumn: typeof unhideColumn;
    toggleColumn: typeof toggleColumn;
  };
}
