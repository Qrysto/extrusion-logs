'use client';

import { type ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import type { ExtrusionLog } from '@/lib/types';
import { get } from '@/lib/utils';
import { format as formatDate } from 'date-fns';
import { ExtrusionLogTable } from './DataTable';

const dateFormat = 'PP';
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

  return [
    ch.accessor('date', {
      header: 'Date',
      cell: ({ getValue }) => formatDate(getValue<Date>(), dateFormat),
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
      header: 'Billet length',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('billetQuantity', {
      header: 'Billet quantity',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('billetKgpm', {
      header: 'Billet kg/m',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('ramSpeed', {
      header: 'Ram speed',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('dieCode', { header: 'Die code' }),
    ch.accessor('dieNumber', {
      header: 'Die number',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('cavity', {
      header: 'Cavity',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('productKgpm', {
      header: 'Product kg/m',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('ingotRatio', {
      header: 'Ingot ratio',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('orderLength', {
      header: 'Order length',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('billetTemp', {
      header: 'Billet temp.',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('outputTemp', {
      header: 'Output temp.',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('productionQuantity', {
      header: 'Oroduction quantity',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('productionWeight', {
      header: 'Production weight',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('outputRate', {
      header: 'Output rate',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('outputYield', {
      header: 'Yield',
      cell: ({ getValue }) => formatNumber(getValue<number>()) + '%',
    }),
    ch.accessor('ok', {
      header: 'OK/NG',
      cell: ({ getValue }) => (getValue<boolean>() ? 'OK' : 'NG'),
    }),
    ch.accessor('remark', { header: 'Remark' }),
    ch.accessor('startTime', { header: 'Start time' }),
    ch.accessor('endTime', { header: 'End time' }),
    ch.accessor('ngQuantity', {
      header: 'NG quantity',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('ngWeight', {
      header: 'NG weight',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('ngPercentage', {
      header: 'NG',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ch.accessor('code', { header: 'Code' }),
    ch.accessor('buttWeight', {
      header: 'Butt weight',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    }),
    ...adminColumns,
    ch.accessor('employeeId', { header: 'Employee ID' }),
  ];
};

export default function DashboardTable({ isAdmin }: { isAdmin: boolean }) {
  const { data } = useQuery<ExtrusionLog[]>({
    queryKey: ['extrusion-logs'],
    queryFn: () => get('/api/extrusion-logs'),
    staleTime: 60000, // 1 minute
  });

  if (!data) return null;
  console.log(data);

  const columns = getColumns(isAdmin);

  return <ExtrusionLogTable data={data} columns={columns} />;
}
