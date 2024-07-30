'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

interface FormValues {
  username: string;
  password: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = ({ username, password }) =>
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

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
      <div>
        <Button
          disabled={isSubmitting}
          type="submit"
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
}
