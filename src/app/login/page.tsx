import Image from 'next/image';
import { getTranslate } from '@/lib/intl/server';
import LoginForm from './LoginForm';
import LanguageSelector from './LanguageSelector';

export default function Login() {
  const __ = getTranslate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <LanguageSelector />
      <div className="w-full max-w-md space-y-8">
        <Image
          src="/aluko-logo.png"
          alt="Aluko logo"
          width={1137}
          height={226}
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          {__('Sign in to your account')}
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
