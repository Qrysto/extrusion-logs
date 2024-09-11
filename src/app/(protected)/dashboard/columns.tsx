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
import { displayDateFormat } from '@/lib/dateTime';
import { memoize } from '@/lib/utils';

const ch = createColumnHelper<ExtrusionLog>();
const formatNumber = Intl.NumberFormat('en-US').format;

export const getColumns = memoize((isAdmin: boolean) => {
  const adminColumns: ColumnDef<ExtrusionLog>[] = isAdmin
    ? [
        { accessorKey: 'machine', header: 'Machine' },
        { accessorKey: 'plant', header: 'Plant' },
        { accessorKey: 'inch', header: 'Inch' },
      ]
    : [];

  const columns: ColumnDef<ExtrusionLog>[] = [
    ch.group({
      header: 'Date & time',
      columns: [
        ch.accessor('date', {
          header: 'Date',
          cell: ({ getValue }) =>
            formatDate(getValue<Date>(), displayDateFormat),
        }),
        ch.accessor('shift', {
          header: 'Shift',
          cell: ({ getValue }) =>
            getValue<string>() === 'day' ? 'Day' : 'Night',
        }),
        ch.accessor('startTime', {
          header: 'Start time',
          cell: ({ getValue }) => stripSeconds(getValue()),
        }),
        ch.accessor('endTime', {
          header: 'End time',
          cell: ({ getValue }) => stripSeconds(getValue()),
        }),
      ],
    }),
    ch.group({
      header: 'General',
      columns: [
        ch.accessor('item', { header: 'Item' }),
        ch.accessor('customer', { header: 'Customer' }),
      ],
    }),
    ch.group({
      header: 'Billet',
      columns: [
        ch.accessor('billetType', { header: 'Billet type' }),
        ch.accessor('lotNumberCode', { header: 'Lot No.' }),
        ch.accessor('billetLength', {
          header: 'Billet length',
          cell: renderNumberCell,
        }),
        ch.accessor('billetQuantity', {
          header: 'Billet quantity',
          cell: renderNumberCell,
        }),
        ch.accessor('billetKgpm', {
          header: 'Billet kg/m',
          cell: renderNumberCell,
        }),
      ],
    }),
    ch.group({
      header: 'Input',
      columns: [
        ch.accessor('ramSpeed', {
          header: 'Ram speed',
          cell: renderNumberCell,
        }),
        ch.accessor('dieCode', { header: 'Die code' }),
        ch.accessor('dieNumber', {
          header: 'Die number',
          cell: renderNumberCell,
        }),
        ch.accessor('cavity', {
          header: 'Cavity',
          cell: renderNumberCell,
        }),
        ch.accessor('productKgpm', {
          header: 'Product kg/m',
          cell: renderNumberCell,
        }),
        ch.accessor('ingotRatio', {
          header: 'Ingot ratio',
          cell: renderNumberCell,
        }),
        ch.accessor('orderLength', {
          header: 'Order length',
          cell: renderNumberCell,
        }),
      ],
    }),
    ch.group({
      header: 'Temperature',
      columns: [
        ch.accessor('billetTemp', {
          header: 'Billet temp.',
          cell: renderNumberCell,
        }),
        ch.accessor('outputTemp', {
          header: 'Output temp.',
          cell: renderNumberCell,
        }),
      ],
    }),
    ch.group({
      header: 'Output',
      columns: [
        ch.accessor('productionQuantity', {
          header: "Prod. Q'ty",
          cell: renderNumberCell,
        }),
        ch.accessor('productionWeight', {
          header: 'Prod. Weight',
          cell: renderNumberCell,
        }),
        ch.accessor('outputRate', {
          header: 'kg/h',
          cell: renderNumberCell,
        }),
        ch.accessor('outputYield', {
          header: 'Yield',
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
        ch.accessor('ngQuantity', {
          header: "NG Q'ty",
          cell: renderNumberCell,
        }),
        ch.accessor('ngWeight', {
          header: 'NG Weight',
          cell: renderNumberCell,
        }),
        ch.accessor('ngPercentage', {
          header: 'NG %',
          cell: ({ getValue }) => (
            <div className="text-right">
              {formatNumber(getValue<number>()) + '%'}
            </div>
          ),
        }),
        ch.accessor('code', { header: 'Code' }),
        ch.accessor('buttWeight', {
          header: 'Butt weight',
          cell: renderNumberCell,
        }),
        ch.accessor('remark', { header: 'Remark' }),
      ],
    }),
    ch.group({
      header: 'Administration',
      columns: [
        ...adminColumns,
        ch.accessor('employeeId', { header: 'Employee ID' }),
      ],
    }),
  ] as ColumnDef<ExtrusionLog>[];

  return columns;
});

const renderNumberCell: ColumnDefTemplate<
  CellContext<ExtrusionLog, unknown>
> = ({ getValue }) => (
  <div className="text-right">{formatNumber(getValue<number>())}</div>
);

const stripSeconds = (time: string | null) =>
  time && time.substring(0, time.lastIndexOf(':'));
