'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { Locale } from '@/lib/types';
import { translateEn, translateVi, translateKr } from './translate';

export function useLocale() {
  const params = useParams();
  const locale =
    params.locale === 'vi' ? 'vi' : params.locale === 'kr' ? 'kr' : 'en';
  return locale;
}

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
