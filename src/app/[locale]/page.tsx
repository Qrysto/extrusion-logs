import { redirect } from 'next/navigation';
import { locales } from '@/lib/intl/server';

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect(`/${locale}/dashboard`);
}

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}
