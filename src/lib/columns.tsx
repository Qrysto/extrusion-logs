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
        { accessorKey: 'plant', header: __('Plant') },
        { accessorKey: 'machine', header: __('Machine') },
        { accessorKey: 'inch', header: __('Inch') },
      ]
    : [];
  const headerLabel: StringOrTemplateHeader<DashboardTableItem, unknown> = ({
    column,
  }) => getShortLabel(column.id, __);

  const columns: ColumnDef<DashboardTableItem>[] = [
    ch.group({
      header: __('Machine Info'),
      columns: [
        ch.accessor('date', {
          header: headerLabel,
          cell: ({ getValue }) =>
            formatDate(getValue<Date>(), displayDateFormat),
        }),
        ch.display({
          id: 'shift',
          header: headerLabel,
          cell: ({ row }) =>
            isDayShift(row.original.startTime) ? __('Day') : __('Night'),
        }),
        ...adminColumns,
      ],
    }),
    ch.group({
      header: __('Die Info'),
      columns: [
        ch.display({
          id: 'item',
          header: headerLabel,
          cell: () => '',
        }),
        ch.display({
          id: 'customer',
          header: headerLabel,
          cell: () => '',
        }),
        ch.display({
          id: 'productGroup',
          header: headerLabel,
          cell: () => '',
        }),
        ch.accessor('dieCode', { header: headerLabel }),
        ch.accessor('subNumber', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.display({
          id: 'cavity',
          header: headerLabel,
          cell: () => '',
        }),
      ],
    }),
    ch.group({
      header: __('Long Billet'),
      columns: [
        ch.accessor('billetType', { header: headerLabel }),
        ch.accessor('ingotRatio', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.display({
          id: 'billetKgpm',
          header: headerLabel,
          cell: () => '',
        }),
        ch.accessor('lotNumberCode', { header: headerLabel }),
      ],
    }),
    ch.group({
      header: __('Short Billet'),
      columns: [
        ch.accessor('billetLength', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('billetQuantity', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.display({
          id: 'billetWeight',
          header: headerLabel,
          cell: () => '',
        }),
        ch.accessor('buttLength', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
      ],
    }),
    ch.group({
      header: __('Extrusion Details'),
      columns: [
        ch.accessor('dieTemp', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('billetTemp', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('containerTemp', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('outputTemp', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('ramSpeed', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('pressure', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('pullerMode', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('pullerSpeed', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('pullerForce', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('extrusionCycle', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
      ],
    }),
    ch.group({
      header: __('Product'),
      columns: [
        ch.display({
          id: 'productKgpm',
          header: headerLabel,
          cell: () => '',
        }),
        ch.accessor('extrusionLength', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('orderLength', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('segments', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('coolingMethod', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('coolingMode', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('startButt', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('endButt', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
      ],
    }),
    ch.group({
      header: __('Output'),
      columns: [
        ch.accessor('startTime', {
          header: headerLabel,
          cell: ({ getValue }) => stripSeconds(getValue<string>()),
        }),
        ch.accessor('endTime', {
          header: headerLabel,
          cell: ({ getValue }) => stripSeconds(getValue<string>()),
        }),
        ch.display({
          id: 'duration',
          header: headerLabel,
          cell: duration,
        }),
        ch.accessor('productionQuantity', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.display({
          id: 'productionWeight',
          header: headerLabel,
          cell: () => '',
        }),
        ch.display({
          id: 'yield',
          header: headerLabel,
          cell: () => '',
        }),
        ch.accessor('result', { header: headerLabel }),
        ch.accessor('remark', { header: headerLabel }),
        ch.accessor('ngQuantity', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.display({
          id: 'ngWeight',
          header: headerLabel,
          cell: () => '',
        }),
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

const stripSeconds = (time: string | null) =>
  time && time.length === 8 ? time.substring(0, time.lastIndexOf(':')) : time;

function duration({ row }: CellContext<DashboardTableItem, unknown>) {
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

type MutableFields = Exclude<
  keyof ExtrusionLog,
  'id' | 'machine' | 'plant' | 'inch'
>;

type ColumnNames =
  | MutableFields
  | 'shift'
  | 'item'
  | 'customer'
  | 'productGroup'
  | 'cavity'
  | 'billetKgpm'
  | 'billetWeight'
  | 'productKgpm'
  | 'duration'
  | 'productionWeight'
  | 'yield'
  | 'ngWeight'
  | 'machine'
  | 'plant'
  | 'inch';

const mutableFields = new Set<MutableFields>([
  'billetLength',
  'billetQuantity',
  'billetTemp',
  'billetType',
  'buttLength',
  'containerTemp',
  'coolingMethod',
  'coolingMode',
  'date',
  'dieCode',
  'dieTemp',
  'endButt',
  'endTime',
  'extrusionCycle',
  'extrusionLength',
  'ingotRatio',
  'lotNumberCode',
  'ngQuantity',
  'orderLength',
  'outputTemp',
  'pressure',
  'productionQuantity',
  'pullerForce',
  'pullerMode',
  'pullerSpeed',
  'ramSpeed',
  'remark',
  'result',
  'segments',
  'startButt',
  'startTime',
  'subNumber',
]);

const columnNames = mutableFields.union(
  new Set([
    'shift',
    'item',
    'customer',
    'productGroup',
    'cavity',
    'billetKgpm',
    'billetWeight',
    'productKgpm',
    'duration',
    'productionWeight',
    'yield',
    'ngWeight',
    'machine',
    'plant',
    'inch',
  ])
) as Set<ColumnNames>;

function isMutableField(value: string): value is MutableFields {
  return mutableFields.has(value as MutableFields);
}

function isColumnName(value: string): value is ColumnNames {
  return columnNames.has(value as ColumnNames);
}

function getColumnLabel(id: ColumnNames, __: (text: string) => string) {
  switch (id) {
    case 'date':
      return __('Date');
    case 'shift':
      return __('Shift');
    case 'plant':
      return __('Plant');
    case 'machine':
      return __('Machine');
    case 'inch':
      return __('Inch');

    case 'item':
      return __('Item');
    case 'customer':
      return __('Customer');
    case 'productGroup':
      return __('Product Group');
    case 'dieCode':
      return __('Die Code');

    case 'subNumber':
      return [__('Sub Number'), __('Sub No.')];
    case 'cavity':
      return __('Cavity');
    case 'productKgpm':
      return ['Product kg/m', 'kg/m'];

    case 'billetType':
      return [__('Billet Type'), __('Type')];
    case 'billetKgpm':
      return ['Billet kg/m', 'kg/m'];
    case 'billetLength':
      return [__('Short Billet Length'), __('Length')];
    case 'billetQuantity':
      return [__('Short Billet Quantity'), __('Qantity')];
    case 'billetWeight':
      return [__('Short Billet Weight'), __('Weight')];
    case 'ingotRatio':
      return __('Ingot Ratio');
    case 'lotNumberCode':
      return __('Lot No.');

    case 'productKgpm':
      return __('Product kg/m');
    case 'ramSpeed':
      return __('Ram Speed');
    case 'billetTemp':
      return [__('Billet Temperature'), __('Billet')];
    case 'outputTemp':
      return [__('Output Temperature'), __('Output')];
    case 'orderLength':
      return __('Order Length');
    case 'productionQuantity':
      return [__('Production Quantity'), __('Prod. Qty')];
    case 'productionWeight':
      return ['Production Weight', 'Prod. Weight'];

    case 'result':
      return __('Result');
    case 'yield':
      return __('Yield');
    case 'ngQuantity':
      return [__('NG Quantity'), __('NG Qty')];
    case 'ngWeight':
      return __('NG Weight');
    case 'remark':
      return __('Remark');
    case 'buttLength':
      return __('Butt Length');
    case 'startTime':
      return [__('Start time'), __('Start')];
    case 'endTime':
      return [__('End time'), __('End')];
    case 'duration':
      return __('Duration');
    case 'dieTemp':
      return [__('Die Temperature'), __('Die')];
    case 'containerTemp':
      return [__('Container Temperature'), __('Container')];
    case 'pressure':
      return __('Extrusion Pressure');
    case 'pullerMode':
      return [__('Puller Mode'), __('Mode')];
    case 'pullerSpeed':
      return [__('Puller Speed'), __('Speed')];
    case 'pullerForce':
      return [__('Puller Force'), __('Force')];
    case 'extrusionCycle':
      return __('Extrusion Cycle');
    case 'extrusionLength':
      return __('Extrusion Length');
    case 'segments':
      return __('Segments');
    case 'coolingMethod':
      return __('Cooling Method');
    case 'coolingMode':
      return __('Cooling Mode');
    case 'startButt':
      return __('Start Butt');
    case 'endButt':
      return __('End Butt');
    default:
      return '';
  }
}

function getLabel(col: string, __: (text: string) => string) {
  const label = getColumnLabel(col as ColumnNames, __);
  if (!label) {
    console.log(col, label);
  }
  if (typeof label === 'string') {
    return label;
  } else {
    return label[0];
  }
}

function getShortLabel(col: string, __: (text: string) => string) {
  const label = getColumnLabel(col as ColumnNames, __);
  if (typeof label === 'string') {
    return label;
  } else {
    return label[1];
  }
}

function isDayShift(startTime: string | null) {
  if (!startTime) return null;
  const hour = parseInt(startTime.substring(0, 2));
  if (Number.isNaN(hour)) return null;
  const dayShift = hour >= 7 && hour < 19;
  return dayShift;
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
