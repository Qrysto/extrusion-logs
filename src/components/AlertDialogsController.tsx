'use client';

import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { AlertDescriptor } from '@/lib/types';

function getContextWith(
  descriptors: AlertDescriptor[] = [],
  setDescriptors: (value: AlertDescriptor[]) => void = () => {}
) {
  return () => ({
    showDanger: ({
      title,
      description,
    }: {
      title?: ReactNode;
      description?: ReactNode;
    }) => {
      setDescriptors([
        ...descriptors,
        { id: generateId(), type: 'danger', title, description },
      ]);
    },
  });
}

const defaultContext = getContextWith(undefined, undefined)(); // fake default context to satisfy typescript, we never use this

export const AlertDialogsContext =
  createContext<AlertDialogsContextType>(defaultContext);

export default function AlertDialogsController({
  children,
}: {
  children: ReactNode;
}) {
  const [descriptors, setDescriptors] = useState<AlertDescriptor[]>([]);
  const context = useMemo(getContextWith(descriptors, setDescriptors), [
    descriptors,
    setDescriptors,
  ]);

  return (
    <>
      <AlertDialogsContext.Provider value={context}>
        {children}
      </AlertDialogsContext.Provider>
      {descriptors.map(({ id, title, description }) => (
        <AlertDialog key={id}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </>
  );
}

const generateId = (() => {
  let counter = 1;
  return () => counter++;
})();

export type AlertDialogsContextType = ReturnType<
  ReturnType<typeof getContextWith>
>;

export function useShowDanger() {
  const { showDanger } = useContext(AlertDialogsContext);
  return showDanger;
}
