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
  const headerLabel: StringOrTemplateHeader<DashboardTableItem, unknown> = ({
    column,
  }) => getShortLabel(column.id, __);

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
    // ch.group({
    //   header: __('General'),
    //   columns: [
    //     // ch.accessor('item', { header: headerLabel }),
    //     // ch.accessor('customer', { header: headerLabel }),
    //   ],
    // }),
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
    // ch.group({
    //   header: __('Administration'),
    //   columns: [
    //     ...adminColumns,
    //     // ch.accessor('employeeId', { header: 'Employee ID' }),
    //   ],
    // }),
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

function getColumnLabel(id: ColumnNames, __: (text: string) => string) {
  switch (id) {
    case 'date':
      return __('Date');
    // shift': return  'Shift'
    case 'plant':
      return __('Plant');
    case 'machine':
      return __('Machine');
    case 'inch':
      return __('Inch');
    // employeeId': return  'Employee ID'

    // item': return  'Item'
    // customer': return  'Customer'
    case 'dieCode':
      return __('Die Code');

    case 'subNumber':
      return [__('Sub Number'), __('Sub No.')];
    // cavity': return  'Cavity'
    // productKgpm': return  ['Product kg/m', 'kg/m']

    case 'billetType':
      return [__('Billet Type'), __('Type')];
    // billetKgpm': return  ['Billet kg/m', 'kg/m']
    case 'billetLength':
      return [__('Billet Length'), __('Length')];
    case 'billetQuantity':
      return [__('Billet Quantity'), __('Qantity')];
    case 'billetWeight':
      return [__('Billet Weight'), __('Weight')];
    case 'ingotRatio':
      return __('Ingot Ratio');
    case 'lotNumberCode':
      return __('Lot No.');

    case 'ramSpeed':
      return __('Ram Speed');
    case 'billetTemp':
      return [__('Billet Temperature'), __('Billet')];
    case 'outputTemp':
      return [__('Output Temperature'), __('Output')];
    case 'orderLength':
      return __('Order Length');
    // outputRate': return  'kg/h'
    case 'productionQuantity':
      return [__('Production Quantity'), __('Prod. Qty')];
    // productionWeight': return  ['Production Weight', 'Prod. Weight']

    case 'result':
      return __('Result');
    // outputYield': return  'Yield %'
    case 'ngQuantity':
      return [__('NG Quantity'), __('NG Qty')];
    // ngWeight': return  'NG Weight'
    // ngPercentage': return  'NG %'
    case 'remark':
      return __('Remark');
    case 'buttLength':
      return __('Butt Length');
    // code': return  'Code'
    case 'startTime':
      return [__('Start time'), __('Start')];
    case 'endTime':
      return [__('End time'), __('End')];
    case 'workingTime':
      return __('Duration');
    case 'dieTemp':
      return [__('Die Temperature'), __('Die')];
    case 'containerTemp':
      return [__('Container Temperature'), __('Container')];
    case 'pressure':
      return __('Pressure');
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
