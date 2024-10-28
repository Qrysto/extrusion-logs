import type { ReactNode } from 'react';
import type { FullFormValues } from '@/lib/extrusionLogForm';
import type { ExtrusionLog } from '@/app/api/extrusion-logs/route';
import type { MutableFields, ColumnNames } from '@/lib/columns';

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

export type { SuggestionData } from '@/app/api/suggestion-data/route';

export type { ExtrusionLog };

export type DateRange = {
  from: Date;
  to: Date;
};

export type SortOrder = 'asc' | 'desc';

export type { FullFormValues, ColumnNames, MutableFields };

export type Draft = FullFormValues & {
  id: string;
  isDraft: true;
};

export type DashboardTableItem = ExtrusionLog | Draft;

export type Locale = 'en' | 'vi' | 'kr';
