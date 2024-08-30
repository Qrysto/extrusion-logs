import { ReactNode } from 'react';

export interface AuthData {
  sessionId: number;
  accountId: number;
  timestamp: number;
  [key: string]: unknown;
}

export type AlertDescriptor = {
  id: number;
  type: 'danger' | 'info' | 'confirm';
  title?: ReactNode;
  description?: ReactNode;
};
