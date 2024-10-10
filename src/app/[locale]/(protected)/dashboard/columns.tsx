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

const getColumns = memoize((isAdmin: boolean, __: (text: string) => string) => {
  const adminColumns: ColumnDef<DashboardTableItem>[] = isAdmin
    ? [
        { accessorKey: 'machine', header: __('Machine') },
        { accessorKey: 'plant', header: __('Plant') },
        { accessorKey: 'inch', header: __('Inch') },
      ]
    : [];

  const columns: ColumnDef<DashboardTableItem>[] = [
    ch.group({
      header: __('Date & time'),
      columns: [
        ch.accessor('date', {
          header: headerLabel,
          cell: ({ getValue }) =>
            formatDate(getValue<Date>(), displayDateFormat),
        }),
        // ch.accessor('shift', {
        //   header: headerLabel,
        //   cell: ({ getValue }) =>
        //     getValue<string>() === 'DAY' ? 'Day' : 'Night',
        // }),
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
      header: __('General'),
      columns: [
        ch.accessor('item', { header: headerLabel }),
        ch.accessor('customer', { header: headerLabel }),
      ],
    }),
    ch.group({
      header: __('Billet'),
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
        // ch.accessor('billetKgpm', {
        //   header: headerLabel,
        //   cell: renderNumberCell,
        // }),
        ch.accessor('billetWeight', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
      ],
    }),
    ch.group({
      header: __('Input'),
      columns: [
        ch.accessor('ramSpeed', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('dieCode', { header: headerLabel }),
        // ch.accessor('subNumber', {
        //   header: headerLabel,
        //   cell: renderNumberCell,
        // }),
        // ch.accessor('cavity', {
        //   header: headerLabel,
        //   cell: renderNumberCell,
        // }),
        // ch.accessor('productKgpm', {
        //   header: headerLabel,
        //   cell: renderNumberCell,
        // }),
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
      header: __('Temperature'),
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
      header: __('Output'),
      columns: [
        ch.accessor('productionQuantity', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        // ch.accessor('productionWeight', {
        //   header: headerLabel,
        //   cell: renderNumberCell,
        // }),
        // ch.accessor('outputRate', {
        //   header: headerLabel,
        //   cell: renderNumberCell,
        // }),
        // ch.accessor('outputYield', {
        //   header: headerLabel,
        //   cell: ({ getValue }) => (
        //     <div className="text-right">
        //       {formatNumber(getValue<number>()) + '%'}
        //     </div>
        //   ),
        // }),
        ch.accessor('result', { header: headerLabel }),
        ch.accessor('ngQuantity', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        // ch.accessor('ngWeight', {
        //   header: headerLabel,
        //   cell: renderNumberCell,
        // }),
        // ch.accessor('ngPercentage', {
        //   header: headerLabel,
        //   cell: ({ getValue }) => (
        //     <div className="text-right">
        //       {formatNumber(getValue<number>()) + '%'}
        //     </div>
        //   ),
        // }),
        // ch.accessor('code', { header: headerLabel }),
        ch.accessor('buttLength', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('remark', { header: headerLabel }),
      ],
    }),
    ch.group({
      header: __('Administration'),
      columns: [
        ...adminColumns,
        // ch.accessor('employeeId', { header: 'Employee ID' }),
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
  'machine',
  'plant',
  'inch',
  'date',
  'billetType',
  'lotNumberCode',
  'billetLength',
  'billetQuantity',
  'billetWeight',
  'ramSpeed',
  'dieCode',
  'subNumber',
  'ingotRatio',
  'orderLength',
  'billetTemp',
  'outputTemp',
  'productionQuantity',
  'result',
  'remark',
  'startTime',
  'endTime',
  'ngQuantity',
  'buttLength',
  'dieTemp',
  'containerTemp',
  'pressure',
  'pullerMode',
  'pullerSpeed',
  'pullerForce',
  'extrusionCycle',
  'extrusionLength',
  'segments',
  'coolingMethod',
  'coolingMode',
  'startButt',
  'endButt',
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
  // shift: 'Shift',
  plant: 'Plant',
  machine: 'Machine',
  inch: 'Inch',
  // employeeId: 'Employee ID',

  // item: 'Item',
  // customer: 'Customer',
  dieCode: 'Die Code',

  subNumber: ['Sub Number', 'Sub No.'],
  // cavity: 'Cavity',
  // productKgpm: ['Product kg/m', 'kg/m'],

  billetType: ['Billet Type', 'B. Type'],
  // billetKgpm: ['Billet kg/m', 'B. kg/m'],
  billetLength: ['Billet Length', 'B. Length'],
  billetQuantity: ['Billet Quantity', 'B. Qty'],
  billetWeight: ['Billet Weight', 'B. Weight'],
  ingotRatio: 'Ingot Ratio',
  lotNumberCode: 'Lot No.',

  ramSpeed: 'Ram Speed',
  billetTemp: ['Billet Temperature', 'Billet'],
  outputTemp: ['Output Temperature', 'Output'],
  orderLength: 'Order Length',
  // outputRate: 'kg/h',
  productionQuantity: ['Production Quantity', 'Prod. Qty'],
  // productionWeight: ['Production Weight', 'Prod. Weight'],

  result: 'OK/NG',
  // outputYield: 'Yield %',
  ngQuantity: ['NG Quantity', 'NG Qty'],
  // ngWeight: 'NG Weight',
  // ngPercentage: 'NG %',
  remark: 'Remark',
  buttLength: 'Butt Length',
  // code: 'Code',
  startTime: ['Start time', 'Start'],
  endTime: ['End time', 'End'],
  workingTime: 'Duration',
  dieTemp: ['Die Temperature', 'Die'],
  containerTemp: ['Container Temperature', 'Container'],
  pressure: 'Pressure',
  pullerMode: ['Puller Mode', 'Mode'],
  pullerSpeed: ['Puller Speed', 'Speed'],
  pullerForce: ['Puller Force', 'Force'],
  extrusionCycle: 'Extrusion Cycle',
  extrusionLength: 'Extrusion Length',
  segments: 'Segments',
  coolingMethod: 'Cooling Method',
  coolingMode: 'Cooling Mode',
  startButt: 'Start Butt',
  endButt: 'End Butt',
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
