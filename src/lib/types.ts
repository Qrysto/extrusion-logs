import type { ReactNode } from 'react';
import type { FullFormValues } from '@/lib/extrusionLogForm';
import type { ExtrusionLog } from '@/app/api/extrusion-logs/route';
import type {
  MutableFields,
  ColumnNames,
} from '@/app/(protected)/dashboard/columns';

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

export type DateRange = {
  from: Date;
  to: Date;
};

export type SortOrder = 'asc' | 'desc';

export type { FullFormValues, ColumnNames, MutableFields };

export type Draft = FullFormValues & {
  id: string;
  workingTime: undefined;
  isDraft: true;
};

export type DashboardTableItem = ExtrusionLog | Draft;

export type Locale = 'en' | 'vi' | 'kr';
