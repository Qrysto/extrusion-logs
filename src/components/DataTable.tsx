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
} from '@/components/ui/context-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  isMutableField,
  getLabel,
  isDraft,
} from '@/app/[locale]/(protected)/dashboard/columns';
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
  editCell,
}: {
  table: TableType<TData>;
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: Function;
  deleteRow: (row: Row<TData>) => Promise<void>;
  editCell: (cell: Cell<TData, unknown>) => Promise<void>;
}) {
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
                editCell={editCell}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-24 text-center"
              >
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
    const sortable = header.column.getCanSort();
    return (
      <TableHead
        colSpan={header.colSpan}
        className={cn(
          'font-bold whitespace-nowrap group border border-border/50',
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
          : flexRender(header.column.columnDef.header, header.getContext())}
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
    editCell,
    selected,
  }: {
    row: Row<TData>;
    selected: boolean;
    deleteRow: (row: Row<TData>) => Promise<void>;
    editCell: (cell: Cell<TData, unknown>) => Promise<void>;
  }) => {
    const [deleting, setDeleting] = useState<boolean>(false);
    const del = useCallback(async () => {
      setDeleting(true);
      try {
        const confirmed = await confirm({
          title: (
            <span className="text-destructive">Delete Extrusion Log?</span>
          ),
          description: 'Are you sure you want to delete this extrusion log?',
          variant: 'destructive',
          yesLabel: 'Delete',
          noLabel: 'Go back',
        });
        if (confirmed) {
          await deleteRow(row);
        }
      } finally {
        setDeleting(false);
      }
    }, [row]);
    const orig = row.original;
    const rowIsDraft = isDraft(orig);

    return (
      <TableRow
        data-state={selected && 'selected'}
        className={cn(
          rowIsDraft && 'italic opacity-80 cursor-pointer',
          selected && !deleting && 'bg-accent text-accent-foreground',
          deleting && 'bg-destructive text-destructive-foreground'
        )}
        onClick={
          rowIsDraft
            ? () => {
                openDialog(ExtrusionLogDialog, { draft: orig });
              }
            : undefined
        }
      >
        {row.getVisibleCells().map((cell) => (
          <DataCell
            key={cell.id}
            cell={cell}
            deleteRow={del}
            editCell={editCell}
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
    editCell,
  }: {
    cell: Cell<TData, unknown>;
    deleteRow: () => Promise<void>;
    editCell: (cell: Cell<TData, unknown>) => Promise<void>;
  }) => {
    const [editing, setEditing] = useState<boolean>(false);
    const { column } = cell;
    const orig = cell.row.original;
    const rowIsDraft = isDraft(orig);

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

        <ContextMenuContent>
          {isMutableField(column.id) && !rowIsDraft && (
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
              Edit {getLabel(column.id)}
            </ContextMenuItem>
          )}
          {rowIsDraft && (
            <ContextMenuItem
              className="cursor-pointer"
              onClick={(evt) => {
                // Prevent opening Edit dialog twice because clicking menu item is also clicking the row
                evt.stopPropagation();
                openDialog(ExtrusionLogDialog, { draft: orig });
              }}
            >
              <FilePenLine className="w-4 h-4 mr-2" />
              Edit Draft
            </ContextMenuItem>
          )}
          <ContextMenuItem className="cursor-pointer" onClick={deleteRow}>
            <Trash2 className="w-4 h-4 mr-2" />
            {rowIsDraft ? 'Delete Draft' : 'Delete Extrusion Log'}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);
