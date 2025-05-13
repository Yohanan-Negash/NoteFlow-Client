'use client';

import { useEffect } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='max-w-7xl mx-auto py-10 px-4'>
      <div className='bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center'>
        <IconAlertTriangle size={48} className='text-red-500 mb-4' />
        <h2 className='text-xl font-semibold text-red-700 mb-2'>
          Something went wrong!
        </h2>
        <p className='text-red-600 mb-4'>
          There was an error loading this notebook.
        </p>
        <button
          onClick={reset}
          className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
        >
          Try again
        </button>
      </div>
    </div>
  );
}
