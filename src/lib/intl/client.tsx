'use client';

import { useContext, createContext } from 'react';
import { Locale } from '@/lib/types';
import { translateEn, translateVi, translateKr } from './translate';

export const IntlContext = createContext<Locale>('en');

export function useLocale() {
  const locale = useContext(IntlContext);
  return locale;
}

export function useTranslate() {
  const locale = useLocale();
  const translate =
    locale === 'vi' ? translateVi : locale === 'kr' ? translateKr : translateEn;
  return translate;
}
