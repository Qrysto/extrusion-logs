'use client';

import Image from 'next/image';
import { useLocale, useSetLocale } from '@/lib/intl/client';
import { Button } from '@/components/ui/button';

export default function LanguageSelector() {
  const setLocale = useSetLocale();
  const locale = useLocale();
  const img = `/images/${
    locale === 'vi' ? 'vn' : locale === 'kr' ? 'kr' : 'gb'
  }.svg`;
  return (
    <Button
      variant="ghost"
      onClick={() => {
        if (locale === 'en') {
          setLocale('vi');
        } else if (locale === 'vi') {
          setLocale('kr');
        } else {
          setLocale('en');
        }
      }}
      className="space-x-2 absolute top-4 right-4"
    >
      <Image src={img} width={16} height={16} alt={locale} />
      <span>{locale.toUpperCase()}</span>
    </Button>
  );
}
