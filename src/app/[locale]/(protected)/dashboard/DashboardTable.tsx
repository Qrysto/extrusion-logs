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
import { DashboardTableItem } from '@/lib/types';
import { AccountRole } from 'kysely-codegen';
import { del, post } from '@/lib/api';
import { useTranslate, useLocale } from '@/lib/intl/client';
import { toast, flashError, openDialog } from '@/lib/ui';
import { useDrafts, removeDraft } from '@/lib/drafts';
import { getColumns, isMutableField, isDraft } from '@/lib/columns';
import Filters from './Filters';
import ColumnSelector from './ColumnSelector';
import DataTable from '@/components/DataTable';
import { EditExtrusionLogField } from './EditExtrusionLogField';

export default function DashboardTable({ role }: { role: AccountRole }) {
  const __ = useTranslate();
  const locale = useLocale();
  const { data, isFetching, hasNextPage, fetchNextPage, refetch } =
    useExtrusionLogs();
  const { drafts } = useDrafts();
  const flatData = useMemo(
    () => [...drafts, ...(data?.pages?.flatMap((page) => page) || [])],
    [data, drafts]
  );

  const isAdmin = role !== 'team';
  const columns = useMemo(
    () => getColumns(isAdmin, __, locale),
    [isAdmin, __, locale]
  );
  const [sorting, setSorting] = useSortingState();
  const [columnVisibility, setColumnVisibility] = useColumnVisibility();
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable<DashboardTableItem>({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  const deleteRow = useCallback(
    async (row: Row<DashboardTableItem>) => {
      try {
        const orig = row.original;
        if (isDraft(orig)) {
          removeDraft(orig.id);
          toast({
            title: __('Draft has been deleted'),
          });
        } else {
          await del(`/api/extrusion-logs/${orig.id}`);
          toast({
            title: __('Extrusion log has been deleted'),
          });
          await refetch();
        }
      } catch (err: any) {
        flashError({
          message: err?.message ? __(err.message) : String(err),
        });
      }
    },
    [__, refetch]
  );

  const restoreRow = useCallback(
    async (row: Row<DashboardTableItem>) => {
      try {
        const orig = row.original;
        if (isDraft(orig)) return;
        await post(`/api/extrusion-logs/${orig.id}/restore`);
        toast({
          title: __('Extrusion log has been restored'),
        });
        await refetch();
      } catch (err: any) {
        flashError({
          message: err?.message ? __(err.message) : String(err),
        });
      }
    },
    [__, refetch]
  );

  const editCell = useCallback(
    async (cell: Cell<DashboardTableItem, unknown>) =>
      new Promise<void>((resolve) => {
        const field = cell.column.id;
        if (!isMutableField(field)) return;
        const obj = cell.row.original;
        if (isDraft(obj)) return;

        openDialog(EditExtrusionLogField, {
          extrusionLog: obj,
          field,
          onOpenChange: (open) => {
            if (!open) resolve();
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
          {__('Reset sorting')}
        </Button>
      </div>

      <main className="flex-1 min-h-0 w-full">
        <DataTable
          table={table}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          deleteRow={deleteRow}
          restoreRow={restoreRow}
          editCell={editCell}
          readOnly={role === 'admin'}
        />
      </main>
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
