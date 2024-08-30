import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import DisableNumberInputScroll from '@/components/DisableNumberInputScroll';
import './globals.css';
import ClientWrappers from './ClientWrappers';

const inter = Inter({ subsets: ['latin'], variable: '--inter' });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
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
          'min-h-screen bg-background font-inter antialiased',
          inter.variable
        )}
      >
        <ClientWrappers>{children}</ClientWrappers>
        <Toaster />
        <DisableNumberInputScroll />
      </body>
    </html>
  );
}
