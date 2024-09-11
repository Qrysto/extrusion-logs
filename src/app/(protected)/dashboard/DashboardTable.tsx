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
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
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
      <div className="my-3 flex gap-4 items-center flex-wrap flex-shrink-0">
        <ColumnSelector table={table} />
        <Filters isAdmin={isAdmin} />
      </div>

      <main className="flex-1 min-h-0 w-full">
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
    <div className="relative rounded-md border h-full overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 flex-shrink-0 bg-zinc-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortable = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'font-bold whitespace-nowrap hover:bg-secondary group border',
                      header.depth === 1 && 'text-center',
                      sortable && 'cursor-pointer'
                    )}
                    onClick={
                      sortable
                        ? () => {
                            if (sorted === 'asc') {
                              header.column.clearSorting();
                            } else {
                              header.column.toggleSorting(sorted !== 'desc');
                            }
                          }
                        : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {sortable && sorted === false && (
                      <ArrowUpDown className="inline-block ml-2 h-4 w-4 opacity-20 group-hover:opacity-40" />
                    )}
                    {sorted === 'asc' && (
                      <ArrowUp className="inline-block ml-2 h-4 w-4" />
                    )}
                    {sorted === 'desc' && (
                      <ArrowDown className="inline-block ml-2 h-4 w-4" />
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="flex-1">
          {rows?.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="whitespace-nowrap hover:bg-secondary"
                  >
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
