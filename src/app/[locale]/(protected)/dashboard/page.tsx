import { protectPage } from '@/lib/auth';
import Dashboard from './Dashboard';

export default async function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const account = await protectPage(locale);

  return (
    <div className="flex flex-col w-full h-screen px-6">
      <Dashboard account={account} />
    </div>
  );
}
