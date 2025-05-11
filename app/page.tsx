'use client';

import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { useState } from 'react';

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
          <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
            <div className='space-y-2'>
              <Input type='email' placeholder='Email' />
              <Input type='password' placeholder='Password' />
            </div>
            <Button className='w-full' size='lg' type='submit'>
              Sign in
            </Button>
            <Button
              variant='ghost'
              className='w-full text-blue-400'
              onClick={() => setShowSignIn(false)}
            >
              Back
            </Button>
          </form>
        )}

        {showSignUp && (
          <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
            <div className='space-y-2'>
              <Input type='text' placeholder='Name' />
              <Input type='email' placeholder='Email' />
              <Input type='password' placeholder='Password' />
              <Input type='password' placeholder='Confirm Password' />
            </div>
            <Button className='w-full' size='lg' type='submit'>
              Create account
            </Button>
            <Button
              variant='ghost'
              className='w-full'
              onClick={() => setShowSignUp(false)}
            >
              Back
            </Button>
          </form>
        )}

        {/* <div className='mt-8 text-center text-sm text-gray-500'>
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div> */}
      </div>
    </div>
  );
}
