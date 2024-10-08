import { translateEn, translateVi, translateKr } from './translate';

export const locales = ['en', 'vi', 'kr'];
export const defaultLocale = 'en';

export function getTranslate(locale: string) {
  const translate =
    locale === 'vi' ? translateVi : locale === 'kr' ? translateKr : translateEn;
  return translate;
}
