'use client';

import { useEffect, useReducer, ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import {
  AlertDialogCancelElement,
  AlertDialogActionElement,
} from '@/components/ui/alert-dialog';
import { genId } from '@/lib/utils';

const DIALOG_REMOVE_DELAY = 150;

// dummy initial dispatch
let dispatch = (action: Action) => {};
const emptyState: FlashDialog[] = [];

function FlashDialogController() {
  const [dialogs, tempDispatch] = useReducer(reducer, emptyState);
  useEffect(() => {
    dispatch = tempDispatch;
  }, []);

  return dialogs.map(({ id, title, description, actions, ...props }) => (
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
        {!!actions?.length && <AlertDialogFooter>{actions}</AlertDialogFooter>}
      </AlertDialogContent>
    </AlertDialog>
  ));
}

type FlashDialog = AlertDialogProps & {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  actions?: Array<AlertDialogActionElement | AlertDialogCancelElement>;
};

const actionTypes = {
  ADD_DIALOG: 'ADD_DIALOG',
  UPDATE_DIALOG: 'UPDATE_DIALOG',
  DISMISS_DIALOG: 'DISMISS_DIALOG',
  REMOVE_DIALOG: 'REMOVE_DIALOG',
} as const;

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_DIALOG'];
      dialog: FlashDialog;
    }
  | {
      type: ActionType['UPDATE_DIALOG'];
      dialog: Partial<FlashDialog>;
    }
  | {
      type: ActionType['DISMISS_DIALOG'];
      dialogId?: FlashDialog['id'];
    }
  | {
      type: ActionType['REMOVE_DIALOG'];
      dialogId?: FlashDialog['id'];
    };

const dialogTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToDialogRemoveQueue = (dialogId: string) => {
  if (dialogTimeouts.has(dialogId)) {
    return;
  }

  const timeout = setTimeout(() => {
    dialogTimeouts.delete(dialogId);
    dispatch({
      type: 'REMOVE_DIALOG',
      dialogId: dialogId,
    });
  }, DIALOG_REMOVE_DELAY);

  dialogTimeouts.set(dialogId, timeout);
};

export const reducer = (
  state: FlashDialog[],
  action: Action
): FlashDialog[] => {
  switch (action.type) {
    case 'ADD_DIALOG':
      return [...state, action.dialog];

    case 'UPDATE_DIALOG':
      return state.map((t) =>
        t.id === action.dialog.id ? { ...t, ...action.dialog } : t
      );

    case 'DISMISS_DIALOG': {
      const { dialogId } = action;
      if (dialogId) {
        addToDialogRemoveQueue(dialogId);
      } else {
        state.forEach((dialog) => {
          addToDialogRemoveQueue(dialog.id);
        });
      }

      return state.map((t) =>
        t.id === dialogId || dialogId === undefined
          ? {
              ...t,
              open: false,
            }
          : t
      );
    }

    case 'REMOVE_DIALOG':
      if (action.dialogId === undefined) {
        return emptyState;
      }
      return state.filter((t) => t.id !== action.dialogId);
  }
};

type DialogConfig = Omit<FlashDialog, 'id'>;

function flashDialog({ ...props }: DialogConfig) {
  const id = genId();

  const update = (props: FlashDialog) =>
    dispatch({
      type: 'UPDATE_DIALOG',
      dialog: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_DIALOG', dialogId: id });

  dispatch({
    type: 'ADD_DIALOG',
    dialog: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

const dismissDialog = (dialogId?: string) =>
  dispatch({ type: 'DISMISS_DIALOG', dialogId });

export { FlashDialogController, flashDialog, dismissDialog, type DialogConfig };
