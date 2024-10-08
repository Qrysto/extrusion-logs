'use client';

import Image from 'next/image';
import { useLocale, useSetLocale } from '@/lib/intl/client';
import { Button } from '@/components/ui/button';

export default function LanguageSelector() {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const img =
    locale === 'vi' ? '/vn.svg' : locale === 'kr' ? '/kr.svg' : '/gb.svg';
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
