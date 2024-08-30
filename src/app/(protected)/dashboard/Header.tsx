'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { LoggedInAccount } from '@/lib/auth';
import AccountControl from './AccountControl';
import AddExtrusionLog from './AddExtrusionLog';

export default function Header({ account }: { account: LoggedInAccount }) {
  const [employeeId, setEmployeeId] = useState('');

  return (
    <header className="bg-background border-b py-6 flex justify-between items-start shrink-0">
      <div className="flex-1">
        <AddExtrusionLog employeeId={employeeId} />
      </div>

      <Link href="/dashboard" className="flex items-center" prefetch={false}>
        <Image
          src="/aluko-logo.png"
          alt="Aluko logo"
          width={230}
          height={226}
          className="mx-auto h-12 w-auto"
          priority
        />
        <span className="sr-only">Acme Inc</span>
      </Link>

      <div className="flex justify-end items-center flex-1">
        <Input
          value={employeeId}
          onChange={(evt) => setEmployeeId(evt.target.value)}
          placeholder="Employee ID"
          className="w-40"
        />
        <AccountControl account={account} />
      </div>
    </header>
  );
}
