'use client';

import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';
import {
  useQuery,
  useInfiniteQuery,
  keepPreviousData,
} from '@tanstack/react-query';
import { fetchLimit } from './const';
import type { SuggestionData, ExtrusionLog } from './types';
import { get } from './utils';

export function useUpdateSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const updateQueryString = useCallback(
    (name: string, value: any) => {
      const params = new URLSearchParams(searchParams.toString());
      if (
        value === null ||
        value === undefined ||
        value === '' ||
        Number.isNaN(value)
      ) {
        params.delete(name);
      } else {
        params.set(name, String(value));
      }

      return params.toString();
    },
    [searchParams]
  );

  const updateSearchParams = (name: string, value: any) => {
    const queryString = updateQueryString(name, value);
    router.push(pathname + (queryString ? `?${queryString}` : ''));
  };

  return [searchParams, updateSearchParams] as const;
}

export const queryClient = new QueryClient();

export function useSuggestionData() {
  return useQuery<SuggestionData>({
    queryKey: ['suggestion-data'],
    queryFn: async () => await get('/api/suggestion-data'),
    staleTime: 3600000, // 1 hour
  });
}

export async function refreshSuggestionData() {
  return await queryClient.invalidateQueries({ queryKey: ['suggestion-data'] });
}

export function useExtrusionLogs() {
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const shift = searchParams.get('shift');
  const plant = searchParams.get('plant');
  const machine = searchParams.get('machine');
  const item = searchParams.get('item');
  const customer = searchParams.get('customer');
  const dieCode = searchParams.get('dieCode');
  const cavity = searchParams.get('cavity');
  const lotNo = searchParams.get('lotNo');
  const result = searchParams.get('result');
  const remarkSearch = searchParams.get('remarkSearch');
  const sort = searchParams.get('sort');

  const params: Record<string, any> = {};
  if (date) {
    params.date = date;
  }
  if (shift) {
    params.shift = shift;
  }
  if (plant) {
    params.plant = plant;
  }
  if (machine) {
    params.machine = machine;
  }
  if (item) {
    params.item = item;
  }
  if (customer) {
    params.customer = customer;
  }
  if (dieCode) {
    params.dieCode = dieCode;
  }
  if (cavity) {
    params.cavity = cavity;
  }
  if (lotNo) {
    params.lotNo = lotNo;
  }
  if (result) {
    params.result = result;
  }
  if (remarkSearch) {
    params.remarkSearch = remarkSearch;
  }
  if (sort) {
    params.sort = sort;
  }

  return useInfiniteQuery<ExtrusionLog[]>({
    queryKey: ['extrusion-logs', params, sort],
    queryFn: ({ pageParam }) =>
      get('/api/extrusion-logs', { ...params, skip: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage?.length === fetchLimit ? pages.length * fetchLimit : null,
    getPreviousPageParam: (lastPage, pages) =>
      pages?.length ? (pages.length - 1) * fetchLimit : null,
    staleTime: 60000, // 1 minute
    placeholderData: keepPreviousData,
  });
}

export async function refreshAllExtrusionQueries() {
  return await queryClient.invalidateQueries({ queryKey: ['extrusion-logs'] });
}
