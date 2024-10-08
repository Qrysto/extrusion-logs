'use client';

import { useEffect, useCallback } from 'react';
import { atom, useSetAtom, useAtomValue } from 'jotai';
import { Locale } from '@/lib/types';
import Cookies from 'js-cookie';
import { translateEn, translateVi, translateKr } from './translate';

const initialLocale = Cookies.get('locale');

const localeAtom = atom<Locale>(
  initialLocale === 'vi' ? 'vi' : initialLocale === 'kr' ? 'kr' : 'en'
);

export function useLocale() {
  return useAtomValue(localeAtom);
}

export function useSetLocale() {
  const setLocale = useSetAtom(localeAtom);
  return useCallback(
    (locale: Locale) => {
      Cookies.set('locale', locale);
      setLocale(locale);
    },
    [setLocale]
  );
}

export function useTranslate() {
  const locale = useLocale();
  console.log('translate', locale);

  const translate =
    locale === 'vi' ? translateVi : locale === 'kr' ? translateKr : translateEn;
  return translate;
}

export function useLoadLocale(locale: Locale) {
  const setLocale = useSetAtom(localeAtom);
  useEffect(() => {
    setLocale(locale);
  }, []);
}
