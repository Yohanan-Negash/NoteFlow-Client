'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { login } from '@/lib/auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface LoginState {
  success?: boolean;
  error?: string;
  redirectTo?: string;
}

const initialState: LoginState = {};

function SubmitButton() {
  const { pending, data } = useFormStatus();
  const [showEmail, setShowEmail] = useState(false);
  const emailRef = useRef<string | null>(null);

  // Show what email is being submitted
  useEffect(() => {
    if (pending && data) {
      emailRef.current = data.get('email_address') as string;
      setShowEmail(true);
    } else {
      // Hide after submission completes
      const timeout = setTimeout(() => {
        setShowEmail(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [pending, data]);

  return (
    <div>
      <Button
        type='submit'
        className='w-full mb-2'
        disabled={pending}
        aria-disabled={pending}
      >
        {pending ? 'Signing in...' : 'Sign in'}
      </Button>

      {showEmail && emailRef.current && (
        <div className='text-sm text-blue-600 text-center'>
          Signing in with {emailRef.current}
        </div>
      )}
    </div>
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
