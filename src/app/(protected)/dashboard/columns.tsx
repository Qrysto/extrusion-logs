import { ReactNode } from 'react';
import {
  ColumnDef,
  ColumnDefTemplate,
  CellContext,
  StringOrTemplateHeader,
  createColumnHelper,
} from '@tanstack/react-table';
import type { ExtrusionLog } from '@/lib/types';
import { format as formatDate, parse } from 'date-fns';
import { displayDateFormat } from '@/lib/dateTime';
import { memoize } from '@/lib/utils';

const ch = createColumnHelper<ExtrusionLog>();
const formatNumber = Intl.NumberFormat('en-US').format;

const getColumns = memoize((isAdmin: boolean) => {
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
          header: headerLabel,
          cell: ({ getValue }) =>
            formatDate(getValue<Date>(), displayDateFormat),
        }),
        ch.accessor('shift', {
          header: headerLabel,
          cell: ({ getValue }) =>
            getValue<string>() === 'day' ? 'Day' : 'Night',
        }),
        ch.accessor('startTime', {
          header: headerLabel,
          cell: ({ getValue }) => stripSeconds(getValue<string>()),
        }),
        ch.accessor('endTime', {
          header: headerLabel,
          cell: ({ getValue }) => stripSeconds(getValue<string>()),
        }),
        ch.display({
          id: 'workingTime',
          header: headerLabel,
          cell: workingTime,
        }),
      ],
    }),
    ch.group({
      header: 'General',
      columns: [
        ch.accessor('item', { header: headerLabel }),
        ch.accessor('customer', { header: headerLabel }),
      ],
    }),
    ch.group({
      header: 'Billet',
      columns: [
        ch.accessor('billetType', { header: headerLabel }),
        ch.accessor('lotNumberCode', { header: headerLabel }),
        ch.accessor('billetLength', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('billetQuantity', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('billetKgpm', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('billetWeight', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
      ],
    }),
    ch.group({
      header: 'Input',
      columns: [
        ch.accessor('ramSpeed', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('dieCode', { header: headerLabel }),
        ch.accessor('dieNumber', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('cavity', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('productKgpm', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('ingotRatio', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('orderLength', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
      ],
    }),
    ch.group({
      header: 'Temperature',
      columns: [
        ch.accessor('billetTemp', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('outputTemp', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
      ],
    }),
    ch.group({
      header: 'Output',
      columns: [
        ch.accessor('productionQuantity', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('productionWeight', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('outputRate', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('outputYield', {
          header: headerLabel,
          cell: ({ getValue }) => (
            <div className="text-right">
              {formatNumber(getValue<number>()) + '%'}
            </div>
          ),
        }),
        ch.accessor('ok', {
          header: headerLabel,
          cell: ({ getValue }) => (getValue<boolean>() ? 'OK' : 'NG'),
        }),
        ch.accessor('ngQuantity', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('ngWeight', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('ngPercentage', {
          header: headerLabel,
          cell: ({ getValue }) => (
            <div className="text-right">
              {formatNumber(getValue<number>()) + '%'}
            </div>
          ),
        }),
        ch.accessor('code', { header: headerLabel }),
        ch.accessor('buttWeight', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('remark', { header: headerLabel }),
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

const headerLabel: StringOrTemplateHeader<ExtrusionLog, unknown> = ({
  column,
}) => columnLabels[column.id];

const stripSeconds = (time: string | null) =>
  time && time.substring(0, time.lastIndexOf(':'));

function workingTime({ row }: CellContext<ExtrusionLog, unknown>) {
  const startTime = row.getValue<string>('startTime');
  const endTime = row.getValue<string>('endTime');
  if (!startTime || !endTime) {
    return '';
  }

  const date = new Date();
  const start = Math.round(
    parse(startTime, 'HH:mm:ss', date).getTime() / 60000
  );
  const end = Math.round(parse(endTime, 'HH:mm:ss', date).getTime() / 60000);
  let minutes = end - start + (end < start ? 1440 : 0);
  let hours = Math.floor(minutes / 60);
  minutes = minutes - hours * 60;
  return (
    <div className="text-right">
      {hours ? hours + 'h ' : ''}
      {minutes}m
    </div>
  );
}

type ColumnNames = Exclude<keyof ExtrusionLog, 'id'> | 'workingTime';

function isColumnName(value: string): value is ColumnNames {
  return columnNames.has(value as ColumnNames);
}

const columnNames = new Set<ColumnNames>([
  'date',
  'shift',
  'plant',
  'machine',
  'inch',
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
  'ngQuantity',
  'ngWeight',
  'ngPercentage',
  'remark',
  'buttWeight',
  'code',
  'startTime',
  'endTime',
  'workingTime',
]);

type MutableFields = Exclude<
  keyof ExtrusionLog,
  'id' | 'plant' | 'machine' | 'inch' | 'workingTime'
>;

const mutableFields = columnNames.difference(
  new Set(['id', 'plant', 'machine', 'inch', 'workingTime'])
);

function isMutableField(value: string): value is MutableFields {
  return mutableFields.has(value as MutableFields);
}

const columnLabels: Record<ColumnNames, string> = {
  date: 'Date',
  shift: 'Shift',
  plant: 'Plant',
  machine: 'Machine',
  inch: 'Inch',
  employeeId: 'Employee ID',

  item: 'Item',
  customer: 'Customer',
  dieCode: 'Die Code',

  dieNumber: 'Die Number',
  cavity: 'Cavity',
  productKgpm: 'Product kg/m',

  billetType: 'Billet Type',
  billetKgpm: 'Billet kg/m',
  billetLength: 'Length',
  billetQuantity: 'Quantity',
  billetWeight: 'Weight',
  ingotRatio: 'Ingot Ratio',
  lotNumberCode: 'Lot No.',

  ramSpeed: 'Ram Speed',
  billetTemp: 'Billet Temp.',
  outputTemp: 'Output Temp.',
  orderLength: 'Order Length',
  outputRate: 'kg/h',
  productionQuantity: 'Prod. Qty',
  productionWeight: 'Prod. Weight',

  ok: 'OK/NG',
  outputYield: 'Yield',
  ngQuantity: 'NG Qty',
  ngWeight: 'NG Weight',
  ngPercentage: 'NG %',
  remark: 'Remark',
  buttWeight: 'Butt Weight',
  code: 'Code',
  startTime: 'Start',
  endTime: 'Finish',
  workingTime: 'Duration',
};

export {
  getColumns,
  columnNames,
  isColumnName,
  columnLabels,
  mutableFields,
  isMutableField,
};
export type { ColumnNames, MutableFields };
