import { cookies } from 'next/headers';
import { translateEn, translateVi, translateKr } from './translate';

export function getLocale() {
  const locale = cookies().get('locale')?.value;
  switch (locale) {
    case 'vi':
      return 'vi';
    case 'kr':
      return 'kr';
    default:
      return 'en';
  }
}

export function getTranslate() {
  const locale = getLocale();
  const translate =
    locale === 'vi' ? translateVi : locale === 'kr' ? translateKr : translateEn;
  return translate;
}
