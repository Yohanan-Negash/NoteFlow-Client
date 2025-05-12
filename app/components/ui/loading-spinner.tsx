'use client';

import { IconLoader2 } from '@tabler/icons-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({
  size = 24,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center w-full py-8 ${className}`}
    >
      <IconLoader2 size={size} className='animate-spin text-gray-500' />
    </div>
  );
}
