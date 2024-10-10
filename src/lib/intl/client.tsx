'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { Locale } from '@/lib/types';
import { memoize } from '@/lib/utils';
import { translateEn, translateVi, translateKr } from './translate';

export function useLocale() {
  const params = useParams();
  const locale =
    params.locale === 'vi' ? 'vi' : params.locale === 'kr' ? 'kr' : 'en';
  return locale;
}

export const getLocale = memoize((pathname: string) => {
  if (pathname.startsWith('/vi')) {
    return 'vi';
  } else if (pathname.startsWith('/kr')) {
    return 'kr';
  } else {
    return 'en';
  }
});

export function useSetLocale() {
  const router = useRouter();
  const pathname = usePathname();
  return (locale: Locale) => router.push(`/${locale}${pathname.substring(3)}`);
}

export function useTranslate() {
  const locale = useLocale();
  const translate =
    locale === 'vi' ? translateVi : locale === 'kr' ? translateKr : translateEn;
  return translate;
}

export function getTranslate() {
  const locale = getLocale(location.pathname);
  const translate =
    locale === 'vi' ? translateVi : locale === 'kr' ? translateKr : translateEn;
  return translate;
}
