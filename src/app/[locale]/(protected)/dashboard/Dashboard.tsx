'use client';

import { AccountContext } from '@/lib/client';
import { LoggedInAccount } from '@/lib/auth';
import Header from './Header';
import DashboardTable from './DashboardTable';

export default async function DashboardPage({
  account,
}: {
  account: LoggedInAccount;
}) {
  return (
    <AccountContext.Provider value={account}>
      <Header />
      <DashboardTable />
    </AccountContext.Provider>
  );
}
