import type { ReactNode } from 'react';

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

export type SuggestionData = {
  plantList?: string[];
  machineList?: string[];
  itemList: string[];
  customerList: string[];
  dieCodeList: string[];
  lotNoList: string[];
  billetTypeList: string[];
  codeList: string[];
};

export type { ExtrusionLog } from '@/app/api/extrusion-logs/route';

export type DateRange = {
  from: Date;
  to: Date;
};
