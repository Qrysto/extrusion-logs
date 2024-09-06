'use client';

import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { SuggestionData } from './types';
import { get } from './utils';

export function useUpdateSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: any) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, String(value));
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams]
  );

  const updateSearchParams = (name: string, value: any) => {
    const queryString = createQueryString(name, value);
    router.push(pathname + (queryString ? `?${queryString}` : ''));
  };

  return [searchParams, updateSearchParams] as const;
}

export const queryClient = new QueryClient();

export function useSuggestionData() {
  return useQuery<SuggestionData>({
    queryKey: ['suggestion-data'],
    queryFn: async () => await get('/api/suggestion-data'),
    // staleTime: 86400000, // 1 day
  });
}

export async function refreshSuggestionData() {
  return await queryClient.invalidateQueries({ queryKey: ['suggestion-data'] });
}
