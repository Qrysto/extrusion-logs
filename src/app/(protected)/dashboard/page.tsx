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
import ColumnSelector from './ColumnSelector';
import Filters from './Filters';
import AddExtrusionLog from './AddExtrusionLog';
import { loadData } from './loadData';

export default async function Dashboard() {
  const account = await protectPage();
  const data = await loadData();

  return (
    <div className="flex flex-col w-full min-h-screen px-6">
      <header className="bg-background border-b py-4 flex justify-between items-start shrink-0">
        <div className="flex-1">
          <AddExtrusionLog />
        </div>

        <Link href="#" className="flex items-center" prefetch={false}>
          <Image
            src="/aluko-logo.png"
            alt="Aluko logo"
            width={230}
            height={226}
            className="mx-auto h-12 w-auto"
          />
          <span className="sr-only">Acme Inc</span>
        </Link>

        <div className="flex justify-end flex-1">
          <AccountControl account={account} />
        </div>
      </header>

      <div className="my-3 flex gap-4 items-center flex-wrap">
        <ColumnSelector />
        <Filters data={data} />
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
