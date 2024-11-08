'use client';

import { ComponentType, useSyncExternalStore } from 'react';
import { DialogProps } from '@radix-ui/react-dialog';
import { genId } from '@/lib/utils';

const DIALOG_REMOVE_DELAY = 150;

type DialogDescriptor = {
  id: string;
  Component: ComponentType<any>;
  props: any;
};

type Action =
  | {
      type: 'ADD_DIALOG';
      id: string;
      Component: ComponentType<any>;
      props: any;
    }
  | {
      type: 'UPDATE_DIALOG';
      id: string;
      props: any;
    }
  | {
      type: 'DISMISS_DIALOG';
      id?: string;
    }
  | {
      type: 'REMOVE_DIALOG';
      id?: string;
    };

interface FortifiedDialogProps
  extends Omit<DialogProps, 'open' | 'onOpenChange'>,
    Required<Pick<DialogProps, 'open' | 'onOpenChange'>> {}

export const reducer = (
  state: DialogDescriptor[],
  action: Action
): DialogDescriptor[] => {
  switch (action.type) {
    case 'ADD_DIALOG': {
      const { id, Component, props } = action;
      return [...state, { id, Component, props }];
    }

    case 'UPDATE_DIALOG':
      return state.map((dialog) =>
        dialog.id === action.id
          ? { ...dialog, props: { ...dialog.props, ...action.props } }
          : dialog
      );

    case 'DISMISS_DIALOG': {
      const { id } = action;
      return state.map((dialog) =>
        dialog.id === id || id === undefined
          ? {
              ...dialog,
              props: {
                ...dialog.props,
                open: false,
              },
            }
          : dialog
      );
    }

    case 'REMOVE_DIALOG':
      if (action.id === undefined) {
        return [];
      }
      return state.filter((dialog) => dialog.id !== action.id);

    default:
      return state;
  }
};

class DialogStore {
  private state: DialogDescriptor[] = [];
  private listeners: Set<() => void> = new Set();
  private dialogTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  getState() {
    return this.state;
  }

  dispatch(action: Action) {
    this.state = reducer(this.state, action);
    this.notify();
  }

  private queueDialogToRemove(id: string) {
    if (this.dialogTimeouts.has(id)) {
      return;
    }

    const timeout = setTimeout(() => {
      this.dialogTimeouts.delete(id);
      this.dispatch({
        type: 'REMOVE_DIALOG',
        id,
      });
    }, DIALOG_REMOVE_DELAY);

    this.dialogTimeouts.set(id, timeout);
  }

  openDialog<CProps extends FortifiedDialogProps>(
    Component: ComponentType<CProps>,
    props?: Omit<CProps, 'open' | 'defaultOpen' | 'onOpenChange'> &
      Pick<DialogProps, 'onOpenChange'>
  ) {
    const id = genId();

    const dismiss = () => this.dismissDialog(id);
    const update = (newProps: Partial<CProps>) => {
      this.dispatch({
        type: 'UPDATE_DIALOG',
        id,
        props: newProps,
      });
    };

    this.dispatch({
      type: 'ADD_DIALOG',
      id,
      Component,
      props: {
        ...props,
        open: true,
        onOpenChange: (open: boolean) => {
          if (!open) dismiss();
          props?.onOpenChange?.(open);
        },
      },
    });

    return {
      id,
      dismiss,
      update,
    };
  }

  dismissDialog(id?: string) {
    this.dispatch({ type: 'DISMISS_DIALOG', id });
    if (id) {
      this.queueDialogToRemove(id);
    } else {
      this.state.forEach((dialog) => {
        this.queueDialogToRemove(dialog.id);
      });
    }
  }
}

const dialogStore = new DialogStore();

const openDialog = dialogStore.openDialog.bind(dialogStore);
const dismissDialog = dialogStore.dismissDialog.bind(dialogStore);
const subscribe = dialogStore.subscribe.bind(dialogStore);
const getSnapshot = dialogStore.getState.bind(dialogStore);
const emptyArray: any[] = [];
const getServerSnapshot = () => emptyArray;

function DialogController() {
  const dialogs = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return dialogs.map(({ id, Component, props }) => (
    <Component key={id} {...props} />
  ));
}

export {
  type FortifiedDialogProps,
  DialogController,
  openDialog,
  dismissDialog,
};
