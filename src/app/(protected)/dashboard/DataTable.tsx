'use client';

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  flexRender,
  Table as TableType,
  Header,
  Row,
  Cell,
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
import { cn } from '@/lib/utils';
import { genericMemo } from '@/lib/utils';
import { confirm } from '@/lib/flashDialog';

export default function DataTable<TData>({
  table,
  isFetching,
  hasNextPage,
  fetchNextPage,
  deleteRow,
}: {
  table: TableType<TData>;
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: Function;
  deleteRow: (row: Row<TData>) => Promise<void>;
}) {
  const { rows } = table.getRowModel();
  const [deletingRow, setDeletingRow] = useState<string | null>(null);
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
    [isFetching, hasNextPage, fetchNextPage]
  );
  useEffect(() => {
    fetchMoreOnBottomReached(scrollerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <div
      ref={scrollerRef}
      className="relative rounded-md border h-full overflow-auto"
      onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
    >
      <Table>
        <TableHeader className="sticky top-0 flex-shrink-0 bg-zinc-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <DataTableHeaderCell
                  key={header.id}
                  header={header}
                  sorted={header.column.getIsSorted()}
                />
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="flex-1">
          {rows?.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cn(
                  deletingRow === row.id &&
                    'bg-destructive text-destructive-foreground'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <DataTableCell
                    key={cell.id}
                    cell={cell}
                    deleteRow={deleteRow}
                    setDeletingRow={setDeletingRow}
                  />
                ))}
              </TableRow>
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
    </div>
  );
}

const DataTableHeaderCell = genericMemo(
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

const DataTableCell = genericMemo(
  <TData,>({
    cell,
    setDeletingRow,
    deleteRow,
  }: {
    cell: Cell<TData, unknown>;
    setDeletingRow: Dispatch<SetStateAction<string | null>>;
    deleteRow: (row: Row<TData>) => Promise<void>;
  }) => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableCell className="whitespace-nowrap hover:bg-accent hover:text-accent-foreground">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem className="cursor-pointer">
          <FilePenLine className="w-4 h-4 mr-2" />
          Edit
        </ContextMenuItem>
        <ContextMenuItem
          className="cursor-pointer"
          onClick={async () => {
            setDeletingRow(cell.row.id);
            try {
              const confirmed = await confirm({
                title: (
                  <span className="text-destructive">
                    Delete Extrusion Log?
                  </span>
                ),
                description:
                  'Are you sure you want to delete this extrusion log?',
                variant: 'destructive',
                yesLabel: 'Delete',
                noLabel: 'Go back',
              });
              if (confirmed) {
                await deleteRow(cell.row);
              }
            } finally {
              setDeletingRow(null);
            }
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Extrusion Log
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
);
