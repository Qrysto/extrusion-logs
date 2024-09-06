'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import type { ExtrusionLog } from '@/lib/types';
import { get } from '@/lib/utils';
import { ExtrusionLogTable } from './DataTable';

export const columns: ColumnDef<ExtrusionLog>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'machine', header: 'Machine' },
  { accessorKey: 'plant', header: 'Plant' },
  { accessorKey: 'inch', header: 'Inch' },
  { accessorKey: 'employeeId', header: 'Employee ID' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'shift', header: 'Shift' },
  { accessorKey: 'item', header: 'Item' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'billetType', header: 'Billet type' },
  { accessorKey: 'lotNumberCode', header: 'Lot No.' },
  { accessorKey: 'billetLength', header: 'Billet length' },
  { accessorKey: 'billetQuantity', header: 'Billet quantity' },
  { accessorKey: 'billetKgpm', header: 'Billet kg/m' },
  { accessorKey: 'ramSpeed', header: 'Ram speed' },
  { accessorKey: 'dieCode', header: 'Die code' },
  { accessorKey: 'dieNumber', header: 'Die number' },
  { accessorKey: 'cavity', header: 'Cavity' },
  { accessorKey: 'productKgpm', header: 'Product kg/m' },
  { accessorKey: 'ingotRatio', header: 'Ingot ratio' },
  { accessorKey: 'orderLength', header: 'Order length' },
  { accessorKey: 'billetTemp', header: 'Billet temp.' },
  { accessorKey: 'outputTemp', header: 'Output temp.' },
  { accessorKey: 'productionQuantity', header: 'Oroduction quantity' },
  { accessorKey: 'productionWeight', header: 'Production weight' },
  { accessorKey: 'outputRate', header: 'Output rate' },
  { accessorKey: 'outputYield', header: 'Yield' },
  { accessorKey: 'ok', header: 'OK/NG' },
  { accessorKey: 'remark', header: 'Remark' },
  { accessorKey: 'startTime', header: 'Start time' },
  { accessorKey: 'endTime', header: 'End time' },
  { accessorKey: 'ngQuantity', header: 'NG quantity' },
  { accessorKey: 'ngWeight', header: 'NG weight' },
  { accessorKey: 'ngPercentage', header: 'NG %' },
  { accessorKey: 'code', header: 'Code' },
  { accessorKey: 'buttWeight', header: 'Butt weight' },
];

export default function DashboardTable() {
  const { data } = useQuery<ExtrusionLog[]>({
    queryKey: ['extrusion-logs'],
    queryFn: () => get('/api/extrusion-logs'),
    staleTime: 60000, // 1 minute
  });

  if (!data) return null;

  return <ExtrusionLogTable data={data} columns={columns} />;
}
