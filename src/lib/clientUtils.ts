'use client';

import { useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

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
