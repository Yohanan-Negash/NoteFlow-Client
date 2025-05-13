'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { register } from '@/lib/actions/auth';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';

interface RegisterState {
  success?: boolean;
  error?: string;
  redirectTo?: string;
}

const initialState: RegisterState = {};

function SubmitButton() {
  const { pending, data } = useFormStatus();

  return (
    <Button
      type='submit'
      className='w-full'
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? 'Creating account...' : 'Create account'}
    </Button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction] = useActionState<RegisterState, FormData>(
    register,
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
            type='password'
            className='text-black'
            placeholder='Password'
            required
            autoComplete='new-password'
          />
        </div>
        <div className='space-y-2'>
          <Input
            id='password_confirmation'
            name='password_confirmation'
            type='password'
            className='text-black'
            placeholder='Confirm password'
            required
            autoComplete='new-password'
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
