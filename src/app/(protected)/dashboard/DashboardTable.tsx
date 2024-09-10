'use client';

import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import type { ExtrusionLog } from '@/lib/types';
import { format as formatDate } from 'date-fns';
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
      header: 'Date',
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
      header: () => <div className="text-right">Billet length</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('billetQuantity', {
      header: () => <div className="text-right">Billet quantity</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('billetKgpm', {
      header: () => <div className="text-right">Billet kg/m</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('ramSpeed', {
      header: () => <div className="text-right">Ram speed</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('dieCode', { header: 'Die code' }),
    ch.accessor('dieNumber', {
      header: () => <div className="text-right">Die number</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('cavity', {
      header: () => <div className="text-right">Cavity</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('productKgpm', {
      header: () => <div className="text-right">Product kg/m</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('ingotRatio', {
      header: () => <div className="text-right">Ingot ratio</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('orderLength', {
      header: () => <div className="text-right">Order length</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('billetTemp', {
      header: () => <div className="text-right">Billet temp.</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('outputTemp', {
      header: () => <div className="text-right">Output temp.</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('productionQuantity', {
      header: () => <div className="text-right">Oroduction quantity</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('productionWeight', {
      header: () => <div className="text-right">Production weight</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('outputRate', {
      header: () => <div className="text-right">Output rate</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('outputYield', {
      header: () => <div className="text-right">Yield</div>,
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
      header: () => <div className="text-right">NG quantity</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('ngWeight', {
      header: () => <div className="text-right">NG weight</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
    }),
    ch.accessor('ngPercentage', {
      header: () => <div className="text-right">NG</div>,
      cell: ({ getValue }) => (
        <div className="text-right">
          {formatNumber(getValue<number>()) + '%'}
        </div>
      ),
    }),
    ch.accessor('code', { header: 'Code' }),
    ch.accessor('buttWeight', {
      header: () => <div className="text-right">Butt weight</div>,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(getValue<number>())}</div>
      ),
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
