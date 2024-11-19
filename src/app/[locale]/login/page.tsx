import Image from 'next/image';
import { getTranslate } from '@/lib/intl/server';
import LoginForm from './LoginForm';
import DynamicLanguageSelector from '@/components/DynamicLanguageSelector';

export default function Login({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const __ = getTranslate(locale);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <DynamicLanguageSelector className="absolute top-4 right-4" />
      <div className="w-full max-w-md space-y-8">
        <Image
          src="/images/aluko-logo.png"
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
