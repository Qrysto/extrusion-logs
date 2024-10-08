'use client';

import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import { Locale } from '@/lib/types';
import { useLoadLocale } from '@/lib/intl/client';
import { queryClient } from '@/lib/client';

export default function ClientWrappers({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  useLoadLocale(locale);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
