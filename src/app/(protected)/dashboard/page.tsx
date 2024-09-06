import { protectPage } from '@/lib/auth';
import ColumnSelector from './ColumnSelector';
import Filters from './Filters';
import Header from './Header';
import DashboardTable from './DashboardTable';

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
        <DashboardTable />
      </main>
    </div>
  );
}
