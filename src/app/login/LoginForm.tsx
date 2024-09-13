'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { post } from '@/lib/api';

interface FormValues {
  username: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async ({
    username,
    password,
  }) => {
    try {
      await post('/api/login', { username, password });
    } catch (err: any) {
      setError('root', { message: err?.message });
      return;
    }

    router.push('/dashboard');
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="email" className="sr-only">
          Extrusion team
        </Label>
        <Input
          id="extrusion-team"
          type="text"
          required
          className="relative block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          placeholder="Extrusion team"
          {...register('username')}
        />
      </div>
      <div>
        <Label htmlFor="password" className="sr-only">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          className="relative block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          placeholder="Password"
          {...register('password')}
        />
      </div>
      {errors?.root && (
        <Alert variant="destructive">
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      )}
      <div>
        <Button
          disabled={isSubmitting}
          type="submit"
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-2"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
}
