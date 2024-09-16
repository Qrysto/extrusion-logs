'use client';

import { useExtrusionLogs } from '@/lib/client';
import { useState, useMemo, useCallback } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Updater,
  VisibilityState,
  Row,
  Cell,
} from '@tanstack/react-table';
import { useUpdateSearchParams } from '@/lib/client';
import { ListRestart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { colVisibilityKey } from '@/lib/const';
import { ExtrusionLog } from '@/lib/types';
import { del } from '@/lib/api';
import { toast } from '@/lib/ui';
import { flashError } from '@/lib/ui';
import { getColumns, isMutableField, MutableFields } from './columns';
import Filters from './Filters';
import ColumnSelector from './ColumnSelector';
import DataTable from '@/components/DataTable';
import { EditExtrusionLogForm, EditingState } from './EditExtrusionLogField';

const emptyData: ExtrusionLog[] = [];

export default function DashboardTable({ isAdmin }: { isAdmin: boolean }) {
  const { data, isFetching, hasNextPage, fetchNextPage, refetch } =
    useExtrusionLogs();
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
  const [editing, setEditing] = useState<EditingState<MutableFields> | null>(
    null
  );

  const deleteRow = useCallback(async (row: Row<ExtrusionLog>) => {
    try {
      await del(`/api/extrusion-logs/${row.original.id}`);
      toast({
        title: 'Extrusion log has been deleted',
      });
      await refetch();
    } catch (err: any) {
      flashError({
        message: err?.message || String(err),
      });
    }
  }, []);

  const editCell = useCallback(
    async (cell: Cell<ExtrusionLog, unknown>) =>
      new Promise<void>((resolve) => {
        const field = cell.column.id;
        if (!isMutableField(field)) return;
        setEditing({
          extrusionLogId: cell.row.original.id,
          field,
          initialValue: cell.row.original[field],
          removeDialog: () => {
            setEditing(null);
            resolve();
          },
        });
      }),
    []
  );

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
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          deleteRow={deleteRow}
          editCell={editCell}
        />
      </main>

      {!!editing && <EditExtrusionLogForm {...editing} />}
    </>
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
