'use client';

import { useExtrusionLogs } from '@/lib/client';
import { useState, useMemo, useCallback } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Updater,
  VisibilityState,
  Table as TableType,
} from '@tanstack/react-table';
import { useUpdateSearchParams } from '@/lib/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { colVisibilityKey } from '@/lib/const';
import { ExtrusionLog } from '@/lib/types';
import { getColumns } from './columns';
import Filters from './Filters';
import ColumnSelector from './ColumnSelector';

const emptyData: ExtrusionLog[] = [];

export default function DashboardTable({ isAdmin }: { isAdmin: boolean }) {
  const { data } = useExtrusionLogs();
  const columns = getColumns(isAdmin);
  const [sorting, setSorting] = useSortingState();
  const [columnVisibility, setColumnVisibility] = useColumnVisibility();
  const table = useReactTable<ExtrusionLog>({
    data: data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <>
      <div className="my-3 flex gap-4 items-center flex-wrap">
        <ColumnSelector table={table} />
        <Filters isAdmin={isAdmin} />
      </div>

      <main className="flex-1 overflow-auto">
        <DataTable table={table} columns={columns} />
      </main>
    </>
  );
}

function DataTable<TData>({
  table,
  columns,
}: {
  table: TableType<TData>;
  columns: ColumnDef<TData>[];
}) {
  const { rows } = table.getRowModel();
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows?.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function useSortingState() {
  const [searchParams, updateSearchParams] = useUpdateSearchParams();
  const sort = searchParams.get('sort');
  const sortingState: SortingState = useMemo(
    () => (sort ? JSON.parse(sort) : []),
    [sort]
  );
  const setSortingState = useCallback(
    (sorting: Updater<SortingState>) => {
      const newState =
        typeof sorting === 'function' ? sorting(sortingState) : sorting;
      updateSearchParams('sort', JSON.stringify(newState));
    },
    [sortingState]
  );
  return [sortingState, setSortingState] as const;
}

function useColumnVisibility() {
  const [visibilityState, setVisibilityState] = useState<VisibilityState>(
    () => {
      if (typeof localStorage === 'undefined') {
        return {};
      }
      const defaultJson = localStorage.getItem(colVisibilityKey);
      let defaultValue = {};
      try {
        defaultValue = defaultJson && JSON.parse(defaultJson);
      } catch (err) {}
      return defaultValue;
    }
  );
  const setColumnVisibility = useCallback(
    (colVis: Updater<VisibilityState>) => {
      const newState =
        typeof colVis === 'function' ? colVis(visibilityState) : colVis;
      setVisibilityState(newState);
      localStorage.setItem(colVisibilityKey, JSON.stringify(newState));
    },
    [visibilityState]
  );
  return [visibilityState, setColumnVisibility] as const;
}
