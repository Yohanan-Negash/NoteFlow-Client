'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { login } from '@/lib/actions/auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface LoginState {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

const initialState: LoginState = {
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      className='w-full mb-2'
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
        <div className='flex items-center justify-center gap-2'>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
          <span>Signing in</span>
        </div>
      ) : (
        'Sign in'
      )}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState<LoginState, FormData>(
    login,
    initialState
  );

  useEffect(() => {
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <div className='w-full space-y-4 sm:max-w-md'>
      <form action={formAction} className='space-y-4'>
        <div className='space-y-2'>
          <Input
            id='email_address'
            name='email_address'
            className='text-black'
            type='email'
            placeholder='Email address'
            required
            autoFocus
            autoComplete='email'
          />
        </div>
        <div className='space-y-2'>
          <Input
            id='password'
            name='password'
            className='text-black'
            type='password'
            placeholder='Password'
            required
            autoComplete='current-password'
          />
        </div>

        {state.error && (
          <div className='p-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded'>
            {state.error}
          </div>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}
