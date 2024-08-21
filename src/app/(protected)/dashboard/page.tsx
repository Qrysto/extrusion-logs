/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/i0OqEtdwoKH
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Archivo } from 'next/font/google'
import { DM_Sans } from 'next/font/google'

archivo({
  subsets: ['latin'],
  display: 'swap',
})

dm_sans({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { protectPage } from '@/lib/auth';
import AccountControl from './AccountControl';

export default async function Dashboard() {
  const account = await protectPage();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="bg-background border-b px-4 py-6 md:px-6 flex justify-between items-center shrink-0">
        <Link href="#" className="flex items-center" prefetch={false}>
          <Image
            src="/aluko-logo.png"
            alt="Aluko logo"
            width={1137}
            height={226}
            className="mx-auto h-12 w-auto"
          />
          <span className="sr-only">Acme Inc</span>
        </Link>

        <div className="flex-1 flex justify-end">
          <AccountControl account={account} />
        </div>
      </header>

      <div className="bg-background border-b px-4 md:px-6 flex items-center h-14 shrink-0">
        <div className="flex items-center gap-4 w-full">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search mold ID..."
              className="pl-8 w-full"
            />
          </div>
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search product ID..."
              className="pl-8 w-full"
            />
          </div>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Date</DropdownMenuCheckboxItem>
              <DropdownMenuItem>
                <div className="flex items-center justify-between">
                  <span>Today</span>
                  <CheckIcon className="h-4 w-4" />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center justify-between">
                  <span>Yesterday</span>
                  <CheckIcon className="h-4 w-4" />
                </div>
              </DropdownMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <DropdownMenuItem>
                    <div className="flex items-center justify-between w-full">
                      <span>Custom date</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </div>
                  </DropdownMenuItem>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-w-[276px]">
                  <Calendar />
                </PopoverContent>
              </Popover>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListOrderedIcon className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Sort
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="date">
                <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="amount">
                  Amount
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="status">
                  Status
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <main className="flex-1 overflow-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                <Badge variant="outline">Paid</Badge>
              </TableCell>
              <TableCell className="text-right">$250.00</TableCell>
              <TableCell className="hidden md:table-cell">2023-04-15</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV002</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                <Badge variant="outline">Pending</Badge>
              </TableCell>
              <TableCell className="text-right">$150.00</TableCell>
              <TableCell className="hidden md:table-cell">2023-05-01</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV003</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                <Badge variant="outline">Unpaid</Badge>
              </TableCell>
              <TableCell className="text-right">$350.00</TableCell>
              <TableCell className="hidden md:table-cell">2023-06-01</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV004</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                <Badge variant="outline">Paid</Badge>
              </TableCell>
              <TableCell className="text-right">$450.00</TableCell>
              <TableCell className="hidden md:table-cell">2023-07-01</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV005</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                <Badge variant="outline">Paid</Badge>
              </TableCell>
              <TableCell className="text-right">$550.00</TableCell>
              <TableCell className="hidden md:table-cell">2023-08-01</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV006</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                <Badge variant="outline">Pending</Badge>
              </TableCell>
              <TableCell className="text-right">$150.00</TableCell>
              <TableCell className="hidden md:table-cell">2023-09-01</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV007</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                <Badge variant="outline">Unpaid</Badge>
              </TableCell>
              <TableCell className="text-right">$250.00</TableCell>
              <TableCell className="hidden md:table-cell">2023-10-01</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV008</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                <Badge variant="outline">Paid</Badge>
              </TableCell>
              <TableCell className="text-right">$450.00</TableCell>
              <TableCell className="hidden md:table-cell">2023-11-01</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV009</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                <Badge variant="outline">Paid</Badge>
              </TableCell>
              <TableCell className="text-right">$550.00</TableCell>
              <TableCell className="hidden md:table-cell">2023-12-01</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV010</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                <Badge variant="outline">Pending</Badge>
              </TableCell>
              <TableCell className="text-right">$150.00</TableCell>
              <TableCell className="hidden md:table-cell">2024-01-01</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </main>
    </div>
  );
}

function CheckIcon(props?: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronRightIcon(props?: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function FilterIcon(props?: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function ListOrderedIcon(props?: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  );
}

function SearchIcon(props?: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon(props?: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
