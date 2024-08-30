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
import ColumnSelector from './ColumnSelector';
import Filters from './Filters';
import Header from './Header';

export default async function Dashboard() {
  const account = await protectPage();
  const isAdmin = account.role === 'admin';

  return (
    <div className="flex flex-col w-full min-h-screen px-6">
      <Header account={account} />

      <div className="my-3 flex gap-4 items-center flex-wrap">
        <ColumnSelector isAdmin={isAdmin} />
        <Filters isAdmin={isAdmin} />
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
