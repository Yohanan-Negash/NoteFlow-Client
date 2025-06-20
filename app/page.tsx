'use client';

import { useState } from 'react';
import { Button } from './components/ui/button';
import { LoginForm } from './components/auth/login-form';
import { RegisterForm } from './components/auth/register-form';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-primary'>
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

        <div className='mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md flex items-start space-x-2'>
          <IconAlertTriangle
            className='text-orange-500 flex-shrink-0 mt-0.5'
            size={18}
          />
          <p className='text-sm text-orange-800'>
            Password reset feature is not live yet! Make sure to remember your
            password.
          </p>
        </div>

        {/* <div className='mt-8 text-center text-sm text-gray-500'>
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div> */}
      </div>
    </div>
  );
}
