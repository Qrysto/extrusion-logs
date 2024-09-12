import { ReactNode } from 'react';
import { OctagonX } from 'lucide-react';
import {
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { flashDialog } from '@/lib/use-toast';

export function flashError({ message }: { message: ReactNode }) {
  return flashDialog({
    title: (
      <div className="flex items-center space-x-2 text-destructive">
        <OctagonX className="w-4 h-4" />
        <span>Error occurred!</span>
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
}: {
  title: ReactNode;
  description?: ReactNode;
  yesLabel?: ReactNode;
  noLabel?: ReactNode;
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
