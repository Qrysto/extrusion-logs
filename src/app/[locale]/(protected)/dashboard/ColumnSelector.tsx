'use client';

import { Table } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { useTranslate } from '@/lib/intl/client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks } from 'lucide-react';
import { getLabel } from './columns';

export default function ColumnSelector<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const __ = useTranslate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-1">
          <ListChecks className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {__('Show/hide columns')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[200px] h-96"
        avoidCollisions
      >
        <ScrollArea className="h-full">
          {table
            ?.getAllLeafColumns()
            .filter((col) => col.getCanHide())
            .map((column, i) => (
              <DropdownMenuCheckboxItem
                key={column.id || i}
                className="cursor-pointer"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                onSelect={(evt) => {
                  // Prevent auto closing dropdown menu
                  evt.preventDefault();
                }}
              >
                {getLabel(column.id)}
              </DropdownMenuCheckboxItem>
            ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
