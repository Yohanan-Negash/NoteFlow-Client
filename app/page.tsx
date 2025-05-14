'use client';

import { useState } from 'react';
import { Button } from './components/ui/button';
import { LoginForm } from './components/auth/login-form';
import { RegisterForm } from './components/auth/register-form';

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-white'>
      <div className='w-full max-w-md px-8 py-12'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>NoteFlow</h1>
          <p className='text-gray-600'>Your thoughts, organized.</p>
        </div>

        {!showSignIn && !showSignUp && (
          <div className='space-y-4'>
            <Button
              className='w-full'
              size='lg'
              onClick={() => {
                setShowSignIn(true);
                setShowSignUp(false);
              }}
            >
              Sign in
            </Button>
            <Button
              variant='outline'
              className='w-full text-blue-400'
              size='lg'
              onClick={() => {
                setShowSignUp(true);
                setShowSignIn(false);
              }}
            >
              Create an account
            </Button>
          </div>
        )}

        {showSignIn && (
          <div className='space-y-4'>
            <LoginForm />
            <Button
              variant='ghost'
              className='w-full text-blue-400'
              onClick={() => setShowSignIn(false)}
            >
              Back
            </Button>
          </div>
        )}

        {showSignUp && (
          <div className='space-y-4'>
            <RegisterForm />
            <Button
              variant='ghost'
              className='w-full text-blue-400'
              onClick={() => setShowSignUp(false)}
            >
              Back
            </Button>
          </div>
        )}

        <p className='text-orange-600 mt-3'>
          ⚠️ Password reset feature is not live yet! Make sure to remember your
          password otherwise your toast.{' '}
        </p>

        {/* <div className='mt-8 text-center text-sm text-gray-500'>
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div> */}
      </div>
    </div>
  );
}
