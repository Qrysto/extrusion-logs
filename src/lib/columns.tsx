import {
  ColumnDef,
  ColumnDefTemplate,
  CellContext,
  StringOrTemplateHeader,
  createColumnHelper,
} from '@tanstack/react-table';
import type { DashboardTableItem, ExtrusionLog, Draft } from '@/lib/types';
import { parse } from 'date-fns';
import { displayDate, timeFormat } from '@/lib/dateTime';

const ch = createColumnHelper<DashboardTableItem>();
const formatNumber = Intl.NumberFormat('en-US').format;

function getColumns(
  isAdmin: boolean,
  __: (text: string) => string,
  localeCode: 'vi' | 'kr' | 'en' = 'en'
) {
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
          cell: ({ getValue }) => displayDate(getValue<Date>(), localeCode),
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
        ch.group({
          header: __('Temperature'),
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
          ],
        }),
        ch.accessor('ramSpeed', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.accessor('pressure', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.group({
          header: __('Puller'),
          columns: [
            ch.accessor('pullerMode', {
              header: headerLabel,
              cell: renderNumberCell,
            }),
            ch.accessor('pullerSpeed', {
              header: headerLabel,
              cell: renderNumberCell,
            }),
          ],
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
        }),
        ch.accessor('coolingMode', {
          header: headerLabel,
          cell: renderNumberCell,
        }),
        ch.group({
          header: __('Straightening Length'),
          columns: [
            ch.accessor('startButt', {
              header: headerLabel,
              cell: renderNumberCell,
            }),
            ch.accessor('beforeSewing', {
              header: headerLabel,
              cell: renderNumberCell,
            }),
            ch.accessor('afterSewing', {
              header: headerLabel,
              cell: renderNumberCell,
            }),
            ch.accessor('endButt', {
              header: headerLabel,
              cell: renderNumberCell,
            }),
          ],
        }),
      ],
    }),
    ch.group({
      header: __('Output'),
      columns: [
        ch.accessor('startTime', {
          header: headerLabel,
          cell: ({ getValue }) => getValue<string>(),
        }),
        ch.accessor('endTime', {
          header: headerLabel,
          cell: ({ getValue }) => getValue<string>(),
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
}

const renderNumberCell: ColumnDefTemplate<
  CellContext<DashboardTableItem, unknown>
> = ({ getValue }) => {
  const value = getValue<number>();
  return <div className="text-right">{value && formatNumber(value)}</div>;
};

function duration({ row }: CellContext<DashboardTableItem, unknown>) {
  const startTime = row.getValue<string>('startTime');
  const endTime = row.getValue<string>('endTime');
  if (!startTime || !endTime) {
    return '';
  }

  const date = new Date();
  const start = Math.round(
    parse(startTime, timeFormat, date).getTime() / 60000
  );
  const end = Math.round(parse(endTime, timeFormat, date).getTime() / 60000);
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
  'id' | 'machine' | 'plant' | 'inch' | 'deleted'
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
  'beforeSewing',
  'afterSewing',
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
      return [__('Production Date'), __('Prod. Date')];
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

    case 'billetType':
      return [__('Billet Type'), __('Type')];
    case 'ingotRatio':
      return __('Ingot Ratio');
    case 'billetKgpm':
      return ['Billet kg/m', 'kg/m'];
    case 'lotNumberCode':
      return __('Lot No.');

    case 'billetLength':
      return [__('Short Billet Length'), __('Length')];
    case 'billetQuantity':
      return [__('Short Billet Quantity'), __('Quantity')];
    case 'billetWeight':
      return [__('Short Billet Weight'), __('Weight')];
    case 'buttLength':
      return __('Butt Length');

    case 'dieTemp':
      return [__('Die Temperature'), __('Die')];
    case 'billetTemp':
      return [__('Billet Temperature'), __('Billet')];
    case 'containerTemp':
      return [__('Container Temperature'), __('Container')];
    case 'outputTemp':
      return [__('Output Temperature'), __('Output')];

    case 'ramSpeed':
      return __('Ram Speed');
    case 'pressure':
      return __('Extrusion Pressure');

    case 'pullerMode':
      return [__('Puller Mode'), __('P.Mode')];
    case 'pullerSpeed':
      return [__('Puller Speed'), __('P.Speed')];

    case 'pullerForce':
      return __('Puller Force');
      __('Force');
    case 'extrusionCycle':
      return __('Extrusion Cycle');

    case 'productKgpm':
      return ['Product kg/m', 'kg/m'];
    case 'extrusionLength':
      return __('Extrusion Length');
    case 'orderLength':
      return __('Order Length');
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
    case 'beforeSewing':
      return __('Before Sewing');
    case 'afterSewing':
      return __('After Sewing');

    case 'startTime':
      return [__('Start time'), __('Start')];
    case 'endTime':
      return [__('End time'), __('End')];
    case 'duration':
      return __('Duration');
    case 'productionQuantity':
      return [__('Production Quantity'), __('Prod. Qty')];
    case 'productionWeight':
      return ['Production Weight', 'Prod. Weight'];

    case 'yield':
      return __('Yield');
    case 'result':
      return __('Result');
    case 'remark':
      return __('Remark');
    case 'ngQuantity':
      return [__('NG Quantity'), __('NG Qty')];
    case 'ngWeight':
      return __('NG Weight');
    default:
      return '';
  }
}

function getColumnUnit(id: ColumnNames) {
  switch (id) {
    case 'ingotRatio':
    case 'yield':
      return '%';

    case 'billetKgpm':
    case 'productKgpm':
      return 'kg/m';

    case 'pullerMode':
      return 'kg';

    case 'extrusionCycle':
      return 's';

    case 'billetWeight':
    case 'productionWeight':
      return 'g';

    case 'billetLength':
    case 'buttLength':
    case 'pullerForce':
    case 'orderLength':
      return 'mm';

    case 'pullerSpeed':
    case 'extrusionLength':
      return 'm';

    case 'dieTemp':
    case 'billetTemp':
    case 'containerTemp':
    case 'outputTemp':
      return <span>&deg;C</span>;

    case 'billetQuantity':
      return 'EA';

    case 'pressure':
      return (
        <span>
          kgf/cm<sup>2</sup>
        </span>
      );

    default:
      return null;
  }
}

function getLabel(col: string, __: (text: string) => string) {
  const label = getColumnLabel(col as ColumnNames, __);
  if (!label) {
    console.log('No label!', col, label);
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
  getColumnUnit,
  mutableFields,
  isMutableField,
  isDraft,
};

export type { ColumnNames, MutableFields };
