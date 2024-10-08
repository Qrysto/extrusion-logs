'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, MoonStar, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LoggedInAccount } from '@/lib/auth';
import { openDialog } from '@/lib/ui';
import AccountControl from './AccountControl';
import ExtrusionLogDialog from '@/components/ExtrusionLogDialog';

export default function Header({ account }: { account: LoggedInAccount }) {
  const [employeeId, setEmployeeId] = useState('');
  const [editing, setEditing] = useState(false);
  const { setTheme, theme } = useTheme();

  return (
    <header className="bg-background border-b py-6 flex justify-between items-start shrink-0">
      <div className="flex-1">
        {account.role === 'team' && (
          <Button
            variant="default"
            onClick={() => {
              openDialog(ExtrusionLogDialog, { employeeId });
            }}
          >
            <Plus className="mr-2" />
            Create extrusion log
          </Button>
        )}
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

      <div className="flex justify-end items-center flex-1 space-x-4">
        <div className="flex items-center">
          {!editing && !!employeeId && (
            <label
              onClick={() => {
                setEditing(true);
              }}
              className="cursor-pointer"
            >
              Employee ID: <strong>{employeeId}</strong>
            </label>
          )}
          {!editing && (
            <Button
              variant="link"
              onClick={() => {
                setEditing(true);
              }}
            >
              {employeeId ? 'Change' : 'Enter Employee ID'}
            </Button>
          )}
        </div>
        {editing && (
          <form
            onSubmit={() => {
              setEditing(false);
            }}
          >
            <Input
              autoFocus
              value={employeeId}
              name="employee_id"
              onChange={(evt) => setEmployeeId(evt.target.value)}
              placeholder="Employee ID"
              className="w-40"
              onBlur={() => {
                setEditing(false);
              }}
            />
          </form>
        )}
        {theme === 'light' ? (
          <Button variant="ghost" onClick={() => setTheme('dark')}>
            <Sun className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => setTheme('light')}>
            <MoonStar className="h-4 w-4" />
          </Button>
        )}
        <AccountControl account={account} />
      </div>
    </header>
  );
}
