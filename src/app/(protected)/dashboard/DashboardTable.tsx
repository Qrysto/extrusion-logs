'use client';

import { useExtrusionLogs } from '@/lib/client';
import { useState, useMemo, useCallback, useRef } from 'react';
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
import { ArrowUpDown, SortAsc, SortDesc, ListRestart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { colVisibilityKey } from '@/lib/const';
import { ExtrusionLog } from '@/lib/types';
import { getColumns } from './columns';
import Filters from './Filters';
import ColumnSelector from './ColumnSelector';

const emptyData: ExtrusionLog[] = [];

export default function DashboardTable({ isAdmin }: { isAdmin: boolean }) {
  const { data, isFetching, hasNextPage, fetchNextPage } = useExtrusionLogs();
  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page) ?? [],
    [data]
  );
  const columns = getColumns(isAdmin);
  const [sorting, setSorting] = useSortingState();
  const [columnVisibility, setColumnVisibility] = useColumnVisibility();
  const table = useReactTable<ExtrusionLog>({
    data: flatData || emptyData,
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
        <Button
          variant="outline"
          disabled={sorting.length === 0}
          onClick={() => {
            table.resetSorting();
          }}
        >
          <ListRestart className="mr-2 h-4 w-4" />
          Reset sorting
        </Button>
      </div>

      <main className="flex-1 min-h-0 w-full">
        <DataTable
          table={table}
          columns={columns}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
        />
      </main>
    </>
  );
}

function DataTable<TData>({
  table,
  columns,
  isFetching,
  hasNextPage,
  fetchNextPage,
}: {
  table: TableType<TData>;
  columns: ColumnDef<TData>[];
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: Function;
}) {
  const { rows } = table.getRowModel();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          hasNextPage &&
          !isFetching &&
          scrollHeight - scrollTop - clientHeight < 200
        ) {
          fetchNextPage();
        }
      }
    },
    [isFetching, hasNextPage, , fetchNextPage]
  );

  return (
    <div
      ref={scrollerRef}
      className="relative rounded-md border h-full overflow-auto"
    >
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
                      'font-bold whitespace-nowrap hover:bg-accent hover:text-accent-foreground group border',
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
                      <SortAsc className="inline-block ml-2 h-4 w-4" />
                    )}
                    {sorted === 'desc' && (
                      <SortDesc className="inline-block ml-2 h-4 w-4" />
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
                    className="whitespace-nowrap hover:bg-accent hover:text-accent-foreground"
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
          {isFetching && (
            <TableRow className="hover:bg-background">
              {table.getVisibleLeafColumns().map((column) => (
                <TableCell key={column.id}>
                  <Skeleton className="w-full h-[20px]" />
                </TableCell>
              ))}
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
    [sortingState, updateSearchParams]
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
