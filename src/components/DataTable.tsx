'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  flexRender,
  Table as TableType,
  HeaderGroup,
  Header,
  Row,
  Cell,
  SortingState,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  SortAsc,
  SortDesc,
  FilePenLine,
  Trash2,
  CopyPlus,
  ArchiveRestore,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { useTranslate } from '@/lib/intl/client';
import { useAccount } from '@/lib/client';
import { Skeleton } from '@/components/ui/skeleton';
import { isMutableField, getLabel, isDraft } from '@/lib/columns';
import { ExtrusionLog } from '@/lib/types';
import ExtrusionLogDialog from '@/components/ExtrusionLogDialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn, genericMemo } from '@/lib/utils';
import { confirm, openDialog } from '@/lib/ui';

export default function DataTable<TData>({
  table,
  isFetching,
  hasNextPage,
  fetchNextPage,
  deleteRow,
  restoreRow,
  editCell,
}: {
  table: TableType<TData>;
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: Function;
  deleteRow: (row: Row<TData>) => Promise<void>;
  restoreRow: (row: Row<TData>) => Promise<void>;
  editCell: (cell: Cell<TData, unknown>) => Promise<void>;
}) {
  const __ = useTranslate();
  const { rows } = table.getRowModel();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (hasNextPage && !isFetching && containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < 200) {
          fetchNextPage();
        }
      }
    },
    [isFetching, hasNextPage, fetchNextPage]
  );
  useEffect(() => {
    fetchMoreOnBottomReached(scrollerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <ScrollArea
      viewportRef={scrollerRef}
      className="relative rounded-md border h-full"
      onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
    >
      <Table className="border-separate border-spacing-0">
        <TableHeader className="sticky top-0 z-10 rounded-t-md flex-shrink-0 bg-background shadow-[0_0_2px_1px_hsl(var(--border))]">
          {table.getHeaderGroups().map((headerGroup) => (
            <HeaderRow
              key={headerGroup.id}
              headerGroup={headerGroup}
              sorting={
                headerGroup.depth > 0 ? table.getState().sorting : undefined
              }
            />
          ))}
        </TableHeader>
        <TableBody className="flex-1">
          {rows?.length ? (
            rows.map((row) => (
              <DataRow
                key={row.id}
                row={row}
                selected={!!table.getSelectedRowModel().rowsById[row.id]}
                deleteRow={deleteRow}
                restoreRow={restoreRow}
                editCell={editCell}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center"
              >
                {__('No results.')}
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
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

const HeaderRow = genericMemo(
  <TData,>({
    headerGroup,
  }: {
    headerGroup: HeaderGroup<TData>;
    // Pass sorting state so that HeaderRow gets rerendered when sorting changes
    sorting?: SortingState;
  }) => (
    <TableRow className="hover:bg-background">
      {headerGroup.headers.map((header) => (
        <HeaderCell
          key={header.id}
          header={header}
          sorted={header.column.getIsSorted()}
        />
      ))}
    </TableRow>
  )
);

const HeaderCell = genericMemo(
  <TData,>({
    header,
    sorted,
  }: {
    header: Header<TData, unknown>;
    sorted: false | 'asc' | 'desc';
  }) => {
    // Don't render these leaf header cells because they are already rendered by their parents
    const columnRelativeDepth = header.depth - header.column.depth;
    if (
      !header.isPlaceholder &&
      columnRelativeDepth > 1 &&
      header.id === header.column.id
    ) {
      return null;
    }

    // Render the leaf header instead of middle placeholders so header names are correctly displayed
    let headerToRender = header;
    let rowSpan = 1;
    while (
      headerToRender.isPlaceholder &&
      headerToRender.subHeaders.length === 1
    ) {
      headerToRender = headerToRender.subHeaders[0];
      rowSpan++;
    }

    const sortable = headerToRender.column.getCanSort();
    return (
      <TableHead
        colSpan={headerToRender.colSpan}
        rowSpan={rowSpan}
        className={cn(
          'font-bold whitespace-nowrap group border border-border/50',
          headerToRender.colSpan > 1 && 'text-center',
          sortable && 'cursor-pointer'
        )}
        onClick={
          sortable
            ? () => {
                if (sorted === 'asc') {
                  headerToRender.column.clearSorting();
                } else {
                  headerToRender.column.toggleSorting(sorted !== 'desc');
                }
              }
            : undefined
        }
      >
        {headerToRender.isPlaceholder
          ? null
          : flexRender(
              headerToRender.column.columnDef.header,
              headerToRender.getContext()
            )}
        {sortable && sorted === false && (
          <ArrowUpDown className="inline-block ml-2 h-4 w-4 opacity-20 group-hover:opacity-40" />
        )}
        {sorted === 'asc' && <SortAsc className="inline-block ml-2 h-4 w-4" />}
        {sorted === 'desc' && (
          <SortDesc className="inline-block ml-2 h-4 w-4" />
        )}
      </TableHead>
    );
  }
);

const DataRow = genericMemo(
  <TData,>({
    row,
    deleteRow,
    restoreRow,
    editCell,
    selected,
  }: {
    row: Row<TData>;
    selected: boolean;
    deleteRow: (row: Row<TData>) => Promise<void>;
    restoreRow: (row: Row<TData>) => Promise<void>;
    editCell: (cell: Cell<TData, unknown>) => Promise<void>;
  }) => {
    const __ = useTranslate();
    const orig = row.original;
    const isExtrusionLog = (object: any): object is ExtrusionLog => {
      return !isDraft(orig);
    };
    const rowIsDraft = isDraft(orig);

    const [deleting, setDeleting] = useState<boolean>(false);
    const del = useCallback(async () => {
      setDeleting(true);
      try {
        const confirmed = await confirm({
          title: (
            <span className="text-destructive">
              {__('Delete Extrusion Log?')}
            </span>
          ),
          description: __(
            'Are you sure you want to delete this extrusion log?'
          ),
          variant: 'destructive',
          yesLabel: __('Delete'),
          noLabel: __('Go back'),
        });
        if (confirmed) {
          await deleteRow(row);
        }
      } finally {
        setDeleting(false);
      }
    }, [row, __, deleteRow]);

    const [restoring, setRestoring] = useState<boolean>(false);
    const restore = useCallback(async () => {
      setRestoring(true);
      try {
        const confirmed = await confirm({
          title: (
            <span className="text-destructive">
              {__('Restore Extrusion Log?')}
            </span>
          ),
          description: __(
            'Are you sure you want to restore this extrusion log?'
          ),
          variant: 'default',
          yesLabel: __('Restore'),
          noLabel: __('Cancel'),
        });
        if (confirmed) {
          await restoreRow(row);
        }
      } finally {
        setRestoring(false);
      }
    }, [row, __, restoreRow]);

    const duplicate = useCallback(() => {
      if (isExtrusionLog(orig)) {
        openDialog(ExtrusionLogDialog, { fromExtrusionLog: orig });
      }
    }, [orig]);

    const edit = useCallback(() => {
      if (isExtrusionLog(orig)) {
        openDialog(ExtrusionLogDialog, {
          fromExtrusionLog: orig,
          editId: orig.id,
        });
      }
    }, [orig]);

    return (
      <TableRow
        data-state={selected && 'selected'}
        className={cn(
          rowIsDraft && 'italic opacity-80 cursor-pointer',
          selected && !deleting && 'bg-accent text-accent-foreground',
          deleting && 'bg-destructive text-destructive-foreground',
          restoring && 'bg-primary text-primary-foreground',
          (orig as ExtrusionLog).deleted && 'text-destructive'
        )}
        onClick={
          rowIsDraft
            ? () => {
                openDialog(ExtrusionLogDialog, { fromDraft: orig });
              }
            : undefined
        }
      >
        {row.getVisibleCells().map((cell) => (
          <DataCell
            key={cell.id}
            cell={cell}
            deleteRow={del}
            restoreRow={restore}
            editCell={editCell}
            duplicateRow={duplicate}
            editRow={edit}
          />
        ))}
      </TableRow>
    );
  }
);

const DataCell = genericMemo(
  <TData,>({
    cell,
    deleteRow,
    restoreRow,
    editCell,
    duplicateRow,
    editRow,
  }: {
    cell: Cell<TData, unknown>;
    deleteRow: () => Promise<void>;
    restoreRow: () => Promise<void>;
    editCell: (cell: Cell<TData, unknown>) => Promise<void>;
    duplicateRow: () => void;
    editRow: () => void;
  }) => {
    const __ = useTranslate();
    const account = useAccount();
    const readOnly = account.role === 'admin';
    const [editing, setEditing] = useState<boolean>(false);
    const { column } = cell;
    const orig = cell.row.original;
    const rowIsDraft = isDraft(orig);
    const deleted = (orig as ExtrusionLog).deleted;

    return (
      <ContextMenu
        onOpenChange={(open) => {
          cell.row.toggleSelected(open);
        }}
      >
        <ContextMenuTrigger asChild>
          <TableCell
            className={cn(
              'whitespace-nowrap',
              !rowIsDraft && 'hover:bg-accent hover:text-accent-foreground',
              editing && 'bg-primary'
            )}
          >
            {flexRender(column.columnDef.cell, cell.getContext())}
          </TableCell>
        </ContextMenuTrigger>

        {!readOnly && (
          <ContextMenuContent>
            {isMutableField(column.id) && !rowIsDraft && (
              <>
                <ContextMenuItem
                  className="cursor-pointer"
                  onClick={async () => {
                    setEditing(true);
                    try {
                      await editCell(cell);
                    } finally {
                      setEditing(false);
                    }
                  }}
                >
                  <FilePenLine className="w-4 h-4 mr-2" />
                  {__('Edit %columnName%', {
                    columnName: getLabel(column.id, __),
                  })}
                </ContextMenuItem>
                <ContextMenuSeparator />
              </>
            )}

            <ContextMenuItem className="cursor-pointer" onClick={duplicateRow}>
              <CopyPlus className="w-4 h-4 mr-2" />
              {__('Duplicate Extrusion Log')}
            </ContextMenuItem>

            <ContextMenuItem className="cursor-pointer" onClick={editRow}>
              <FilePenLine className="w-4 h-4 mr-2" />
              {__('Edit Extrusion Log')}
            </ContextMenuItem>

            {rowIsDraft && (
              <ContextMenuItem
                className="cursor-pointer"
                onClick={(evt) => {
                  // Prevent opening Edit dialog twice because clicking menu item is also clicking the row
                  evt.stopPropagation();
                  openDialog(ExtrusionLogDialog, { fromDraft: orig });
                }}
              >
                <FilePenLine className="w-4 h-4 mr-2" />
                {__('Edit Draft')}
              </ContextMenuItem>
            )}

            {!deleted && (
              <ContextMenuItem className="cursor-pointer" onClick={deleteRow}>
                <Trash2 className="w-4 h-4 mr-2" />
                {rowIsDraft ? __('Delete Draft') : __('Delete Extrusion Log')}
              </ContextMenuItem>
            )}

            {deleted && !rowIsDraft && (
              <ContextMenuItem className="cursor-pointer" onClick={restoreRow}>
                <ArchiveRestore className="w-4 h-4 mr-2" />
                {__('Restore Extrusion Log')}
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        )}
      </ContextMenu>
    );
  }
);
