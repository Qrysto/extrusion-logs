import { protectPage } from '@/lib/auth';
import Header from './Header';
import DashboardTable from './DashboardTable';

export default async function Dashboard({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const account = await protectPage(locale);
  const isAdmin = account.role === 'admin';

  return (
    <div className="flex flex-col w-full h-screen px-6">
      <Header account={account} />

      <DashboardTable isAdmin={isAdmin} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
