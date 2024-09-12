'use client';

// Inspired by react-hot-toast library
import * as React from 'react';

import type { ToastActionElement, ToastProps } from '@/components/ui/toast';
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import {
  AlertDialogCancelElement,
  AlertDialogActionElement,
} from '@/components/ui/alert-dialog';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const DIALOG_REMOVE_DELAY = 150;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type FlashDialog = AlertDialogProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: Array<AlertDialogActionElement | AlertDialogCancelElement>;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  ADD_DIALOG: 'ADD_DIALOG',
  UPDATE_DIALOG: 'UPDATE_DIALOG',
  DISMISS_DIALOG: 'DISMISS_DIALOG',
  REMOVE_DIALOG: 'REMOVE_DIALOG',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    }
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

interface State {
  toasts: ToasterToast[];
  dialogs: FlashDialog[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const dialogTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToToastRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

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

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToToastRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToToastRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    case 'ADD_DIALOG':
      return {
        ...state,
        dialogs: [...state.dialogs, action.dialog],
      };

    case 'UPDATE_DIALOG':
      return {
        ...state,
        dialogs: state.dialogs.map((t) =>
          t.id === action.dialog.id ? { ...t, ...action.dialog } : t
        ),
      };

    case 'DISMISS_DIALOG': {
      const { dialogId } = action;
      if (dialogId) {
        addToDialogRemoveQueue(dialogId);
      } else {
        state.dialogs.forEach((dialog) => {
          addToDialogRemoveQueue(dialog.id);
        });
      }

      return {
        ...state,
        dialogs: state.dialogs.map((t) =>
          t.id === dialogId || dialogId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_DIALOG':
      if (action.dialogId === undefined) {
        return {
          ...state,
          dialogs: [],
        };
      }
      return {
        ...state,
        dialogs: state.dialogs.filter((t) => t.id !== action.dialogId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [], dialogs: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;
type DialogConfig = Omit<FlashDialog, 'id'>;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

const dismissToast = (toastId?: string) =>
  dispatch({ type: 'DISMISS_TOAST', toastId });

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
    id: id,
    dismiss,
    update,
  };
}

const dismissDialog = (dialogId?: string) =>
  dispatch({ type: 'DISMISS_DIALOG', dialogId });

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismissToast,
    flashDialog,
    dismissDialog,
  };
}

export { useToast, toast, flashDialog };
