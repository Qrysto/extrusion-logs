'use client';

import Image from 'next/image';
import { useLocale, useSetLocale } from '@/lib/intl/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LanguageSelector({
  className,
}: {
  className?: string;
}) {
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
      className={cn('space-x-2', className)}
    >
      <Image src={img} width={16} height={16} alt={locale} />
      <span>{locale.toUpperCase()}</span>
    </Button>
  );
}
