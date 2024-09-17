import type { ReactNode } from 'react';
import type { FormValues } from '@/components/ExtrusionLogForm';
import type { ExtrusionLog } from '@/app/api/extrusion-logs/route';

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

export type { ExtrusionLog };

export type ColumnNames = Exclude<keyof ExtrusionLog, 'id'> | 'workingTime';

export type MutableFields = Exclude<
  keyof ColumnNames,
  'plant' | 'machine' | 'inch' | 'workingTime'
>;

export type DateRange = {
  from: Date;
  to: Date;
};

export type SortOrder = 'asc' | 'desc';

export type ExtrusionLogFormValues = FormValues;

export type Draft = ExtrusionLogFormValues & {
  id: string;
  workingTime: undefined;
  isDraft: true;
};

export type DashboardTableItem = ExtrusionLog | Draft;
