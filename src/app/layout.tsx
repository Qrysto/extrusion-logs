import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { getLocale } from '@/lib/intl/server';
import DisableNumberInputScroll from '@/components/DisableNumberInputScroll';
import { ToastController } from '@/components/ToastController';
import { FlashDialogController } from '@/components/FlashDialogController';
import { DialogController } from '@/components/DialogController';
import ClientWrappers from './ClientWrappers';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--inter' });

export const metadata: Metadata = {
  title: 'Aluko Extrusion Log Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getLocale();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'h-screen bg-background font-inter antialiased flex flex-col overflow-hidden',
          inter.variable
        )}
      >
        <ClientWrappers locale={locale}>
          {children}
          <FlashDialogController />
          <ToastController />
          <DialogController />
        </ClientWrappers>
        <DisableNumberInputScroll />
      </body>
    </html>
  );
}
