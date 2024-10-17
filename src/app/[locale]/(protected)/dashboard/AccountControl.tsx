'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslate } from '@/lib/intl/client';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuArrow,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { post } from '@/lib/api';
import { useRouter } from 'next/navigation';
import type { LoggedInAccount } from '@/lib/auth';

export default function AccountControl({
  account,
}: {
  account: LoggedInAccount;
}) {
  const __ = useTranslate();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  async function logOut() {
    await post('/api/logout');
    router.push('/login');
    router.refresh();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <span className="font-bold mr-1">
              {account.plant ? `[${account.plant}] ` : ''}
              {account.username}
            </span>
            <ChevronDown size={20} className="inline-block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              setOpen(true);
            }}
          >
            {__('Log out')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {__('Are you sure you want to log out?')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{__('Back')}</AlertDialogCancel>
            <AlertDialogAction onClick={logOut}>
              {__('Log out')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
