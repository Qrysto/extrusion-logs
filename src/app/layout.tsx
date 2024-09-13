import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import DisableNumberInputScroll from '@/components/DisableNumberInputScroll';
import './globals.css';
import ClientWrappers from './ClientWrappers';
import { ToastController } from '@/components/ToastController';
import { DialogController } from '@/components/DialogController';

const inter = Inter({ subsets: ['latin'], variable: '--inter' });

export const metadata: Metadata = {
  title: 'Aluko Extrusion Log Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'h-screen bg-background font-inter antialiased flex flex-col',
          inter.variable
        )}
      >
        <ClientWrappers>{children}</ClientWrappers>
        <DialogController />
        <ToastController />
        <DisableNumberInputScroll />
      </body>
    </html>
  );
}
