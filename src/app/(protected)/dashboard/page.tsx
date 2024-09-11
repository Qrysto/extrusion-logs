import { protectPage } from '@/lib/auth';
import Header from './Header';
import DashboardTable from './DashboardTable';

export default async function Dashboard() {
  const account = await protectPage();
  const isAdmin = account.role === 'admin';

  return (
    <div className="flex flex-col w-full h-screen px-6">
      <Header account={account} />

      <DashboardTable isAdmin={isAdmin} />
    </div>
  );
}
