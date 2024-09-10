'use client';

import { ReactNode } from 'react';
import {
  ColumnDef,
  ColumnDefTemplate,
  CellContext,
  StringOrTemplateHeader,
  createColumnHelper,
} from '@tanstack/react-table';
import type { ExtrusionLog } from '@/lib/types';
import { format as formatDate } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';
import { displayDateFormat } from '@/lib/dateTime';
import { useExtrusionLogs } from '@/lib/client';

const ch = createColumnHelper<ExtrusionLog>();
const formatNumber = Intl.NumberFormat('en-US').format;

export const getColumns = (isAdmin: boolean) => {
  const adminColumns: ColumnDef<ExtrusionLog>[] = isAdmin
    ? [
        { accessorKey: 'machine', header: 'Machine' },
        { accessorKey: 'plant', header: 'Plant' },
        { accessorKey: 'inch', header: 'Inch' },
      ]
    : [];

  const columns: ColumnDef<ExtrusionLog>[] = [
    ch.accessor('date', {
      header: renderHeader('Date', { number: false }),
      cell: ({ getValue }) => formatDate(getValue<Date>(), displayDateFormat),
    }),
    ch.accessor('shift', {
      header: 'Shift',
      cell: ({ getValue }) => (getValue<string>() === 'day' ? 'Day' : 'Night'),
    }),
    ch.accessor('item', { header: 'Item' }),
    ch.accessor('customer', { header: 'Customer' }),
    ch.accessor('billetType', { header: 'Billet type' }),
    ch.accessor('lotNumberCode', { header: 'Lot No.' }),
    ch.accessor('billetLength', {
      header: renderHeader('Billet length'),
      cell: renderNumberCell,
    }),
    ch.accessor('billetQuantity', {
      header: renderHeader('Billet quantity'),
      cell: renderNumberCell,
    }),
    ch.accessor('billetKgpm', {
      header: renderHeader('Billet kg/m'),
      cell: renderNumberCell,
    }),
    ch.accessor('ramSpeed', {
      header: renderHeader('Ram speed'),
      cell: renderNumberCell,
    }),
    ch.accessor('dieCode', { header: 'Die code' }),
    ch.accessor('dieNumber', {
      header: renderHeader('Die number'),
      cell: renderNumberCell,
    }),
    ch.accessor('cavity', {
      header: renderHeader('Cavity'),
      cell: renderNumberCell,
    }),
    ch.accessor('productKgpm', {
      header: renderHeader('Product kg/m'),
      cell: renderNumberCell,
    }),
    ch.accessor('ingotRatio', {
      header: renderHeader('Ingot ratio'),
      cell: renderNumberCell,
    }),
    ch.accessor('orderLength', {
      header: renderHeader('Order length'),
      cell: renderNumberCell,
    }),
    ch.accessor('billetTemp', {
      header: renderHeader('Billet temp.'),
      cell: renderNumberCell,
    }),
    ch.accessor('outputTemp', {
      header: renderHeader('Output temp.'),
      cell: renderNumberCell,
    }),
    ch.accessor('productionQuantity', {
      header: renderHeader('Oroduction quantity'),
      cell: renderNumberCell,
    }),
    ch.accessor('productionWeight', {
      header: renderHeader('Production weight'),
      cell: renderNumberCell,
    }),
    ch.accessor('outputRate', {
      header: renderHeader('Output rate'),
      cell: renderNumberCell,
    }),
    ch.accessor('outputYield', {
      header: renderHeader('Yield'),
      cell: ({ getValue }) => (
        <div className="text-right">
          {formatNumber(getValue<number>()) + '%'}
        </div>
      ),
    }),
    ch.accessor('ok', {
      header: 'OK/NG',
      cell: ({ getValue }) => (getValue<boolean>() ? 'OK' : 'NG'),
    }),
    ch.accessor('remark', { header: 'Remark' }),
    ch.accessor('startTime', { header: 'Start time' }),
    ch.accessor('endTime', { header: 'End time' }),
    ch.accessor('ngQuantity', {
      header: renderHeader('NG quantity'),
      cell: renderNumberCell,
    }),
    ch.accessor('ngWeight', {
      header: renderHeader('NG weight'),
      cell: renderNumberCell,
    }),
    ch.accessor('ngPercentage', {
      header: renderHeader('NG'),
      cell: ({ getValue }) => (
        <div className="text-right">
          {formatNumber(getValue<number>()) + '%'}
        </div>
      ),
    }),
    ch.accessor('code', { header: 'Code' }),
    ch.accessor('buttWeight', {
      header: renderHeader('Butt weight'),
      cell: renderNumberCell,
    }),
    ...adminColumns,
    ch.accessor('employeeId', { header: 'Employee ID' }),
  ] as ColumnDef<ExtrusionLog>[];

  return columns;
};

export default function DashboardTable({ isAdmin }: { isAdmin: boolean }) {
  const { data } = useExtrusionLogs();
  if (!data) return null;

  const columns = getColumns(isAdmin);

  return <DataTable data={data} columns={columns} />;
}

const renderNumberCell: ColumnDefTemplate<
  CellContext<ExtrusionLog, unknown>
> = ({ getValue }) => (
  <div className="text-right">{formatNumber(getValue<number>())}</div>
);

type HeaderRenderer = (
  label: ReactNode,
  options?: {
    sortable?: boolean;
    number?: boolean;
  }
) => StringOrTemplateHeader<ExtrusionLog, unknown>;

const renderHeader: HeaderRenderer =
  (label, options) =>
  ({ column }) => {
    const { sortable = true, number = true } = options || {};
    const headerLabel = number ? (
      <div className="text-right">{label}</div>
    ) : (
      label
    );

    if (sortable) {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {headerLabel}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    } else {
      return headerLabel;
    }
  };
