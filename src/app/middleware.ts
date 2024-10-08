import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

import { NextResponse, NextRequest } from 'next/server';

const locales = ['en', 'vi', 'kr'];
const defaultLocale = 'en';

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  const headers = request.headers
    .entries()
    .reduce((headers, [key, value]) => ({ ...headers, [key]: value }), {});
  const languages = new Negotiator({ headers }).languages();
  match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
