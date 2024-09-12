'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/lib/use-toast';

export function Toaster() {
  const { toasts, dialogs } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      {dialogs.map(function ({ id, title, description, actions, ...props }) {
        return (
          <AlertDialog key={id} {...props}>
            <AlertDialogContent>
              {title && (
                <AlertDialogHeader>
                  <AlertDialogTitle>{title}</AlertDialogTitle>
                </AlertDialogHeader>
              )}

              {description && (
                <AlertDialogDescription>{description}</AlertDialogDescription>
              )}
              {!!actions?.length && (
                <AlertDialogFooter>{actions}</AlertDialogFooter>
              )}
            </AlertDialogContent>
          </AlertDialog>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
