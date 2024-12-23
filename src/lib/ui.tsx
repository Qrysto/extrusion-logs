'use client';

import { ReactNode, ComponentProps } from 'react';
import { OctagonX } from 'lucide-react';
import {
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { flashDialog } from '@/components/FlashDialogController';
import { toast } from '@/components/ToastController';
import { getTranslate } from '@/lib/intl/client';

export { toast };

export function flashError({ message }: { message: ReactNode }) {
  const __ = getTranslate();
  return flashDialog({
    title: (
      <div className="flex items-center space-x-2 text-destructive">
        <OctagonX className="w-4 h-4" />
        <span>{__('Error occurred!')}</span>
      </div>
    ),
    description: message,
    actions: [<AlertDialogCancel key="cancel">OK</AlertDialogCancel>],
  });
}

export function confirm({
  title,
  description,
  yesLabel = 'Yes',
  noLabel = 'No',
  variant,
}: {
  title: ReactNode;
  description?: ReactNode;
  yesLabel?: ReactNode;
  noLabel?: ReactNode;
  variant?: ComponentProps<typeof AlertDialogAction>['variant'];
}) {
  return new Promise<boolean>((resolve, reject) => {
    flashDialog({
      title,
      description,
      actions: [
        <AlertDialogCancel
          key="no"
          onClick={() => {
            resolve(false);
          }}
        >
          {noLabel}
        </AlertDialogCancel>,
        <AlertDialogAction
          variant={variant}
          key="yes"
          onClick={() => {
            resolve(true);
          }}
        >
          {yesLabel}
        </AlertDialogAction>,
      ],
    });
  });
}

export { openDialog, dismissDialog } from '@/components/DialogController';
