import { ReactNode } from 'react';
import {
  ColumnDef,
  ColumnDefTemplate,
  CellContext,
  StringOrTemplateHeader,
  createColumnHelper,
} from '@tanstack/react-table';
import type { DashboardTableItem, ExtrusionLog, Draft } from '@/lib/types';
import { format as formatDate, parse } from 'date-fns';
import { displayDateFormat } from '@/lib/dateTime';
import { memoize } from '@/lib/utils';

const ch = createColumnHelper<DashboardTableItem>();
const formatNumber = Intl.NumberFormat('en-US').format;

const getColumns = memoize((isAdmin: boolean) => {
  const adminColumns: ColumnDef<DashboardTableItem>[] = isAdmin
    ? [
        { accessorKey: 'machine', header: 'Machine' },
        { accessorKey: 'plant', header: 'Plant' },
        { accessorKey: 'inch', header: 'Inch' },
      ]
    : [];

  const columns: ColumnDef<DashboardTableItem>[] = [
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
            getValue<string>() === 'DAY' ? 'Day' : 'Night',
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
        ch.accessor('result', { header: headerLabel }),
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
  ] as ColumnDef<DashboardTableItem>[];

  return columns;
});

const renderNumberCell: ColumnDefTemplate<
  CellContext<DashboardTableItem, unknown>
> = ({ getValue }) => (
  <div className="text-right">{formatNumber(getValue<number>())}</div>
);

const headerLabel: StringOrTemplateHeader<DashboardTableItem, unknown> = ({
  column,
}) => getShortLabel(column.id);

const stripSeconds = (time: string | null) =>
  time && time.length === 8 ? time.substring(0, time.lastIndexOf(':')) : time;

function workingTime({ row }: CellContext<DashboardTableItem, unknown>) {
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

function isDraft(object: any): object is Draft {
  return !!(object as Draft)?.isDraft;
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

  'result',
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
  ColumnNames,
  'plant' | 'machine' | 'inch' | 'workingTime'
>;

const mutableFields = columnNames.difference(
  new Set(['id', 'plant', 'machine', 'inch', 'workingTime'])
);

function isMutableField(value: string): value is MutableFields {
  return mutableFields.has(value as MutableFields);
}

const columnLabels: Record<ColumnNames, string | [string, string]> = {
  date: 'Date',
  shift: 'Shift',
  plant: 'Plant',
  machine: 'Machine',
  inch: 'Inch',
  employeeId: 'Employee ID',

  item: 'Item',
  customer: 'Customer',
  dieCode: 'Die Code',

  dieNumber: ['Die Number', 'Die No.'],
  cavity: 'Cavity',
  productKgpm: ['Product kg/m', 'kg/m'],

  billetType: ['Billet Type', 'B. Type'],
  billetKgpm: ['Billet kg/m', 'B. kg/m'],
  billetLength: ['Billet Length', 'B. Length'],
  billetQuantity: ['Billet Quantity', 'B. Qty'],
  billetWeight: ['Billet Weight', 'B. Weight'],
  ingotRatio: 'Ingot Ratio',
  lotNumberCode: 'Lot No.',

  ramSpeed: 'Ram Speed',
  billetTemp: ['Billet Temperature', 'Billet'],
  outputTemp: ['Output Temperature', 'Output'],
  orderLength: 'Order Length',
  outputRate: 'kg/h',
  productionQuantity: ['Production Quantity', 'Prod. Qty'],
  productionWeight: ['Production Weight', 'Prod. Weight'],

  result: 'OK/NG',
  outputYield: 'Yield %',
  ngQuantity: ['NG Quantity', 'NG Qty'],
  ngWeight: 'NG Weight',
  ngPercentage: 'NG %',
  remark: 'Remark',
  buttWeight: 'Butt Weight',
  code: 'Code',
  startTime: ['Start time', 'Start'],
  endTime: ['End time', 'End'],
  workingTime: 'Duration',
};

function getLabel(col: string) {
  const label = columnLabels[col as ColumnNames];
  if (typeof label === 'string') {
    return label;
  } else {
    return label[0];
  }
}

function getShortLabel(col: string) {
  const label = columnLabels[col as ColumnNames];
  if (typeof label === 'string') {
    return label;
  } else {
    return label[1];
  }
}

export {
  getColumns,
  columnNames,
  isColumnName,
  getLabel,
  getShortLabel,
  mutableFields,
  isMutableField,
  isDraft,
};

export type { ColumnNames, MutableFields };
