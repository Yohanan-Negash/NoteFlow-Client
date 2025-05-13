import { LoadingSpinner } from '@/app/components/ui/loading-spinner';

export default function Loading() {
  return (
    <div className='max-w-7xl mx-auto py-10 px-4'>
      <div className='flex justify-between items-center mb-8'>
        <div className='h-8 w-48 bg-gray-200 rounded animate-pulse'></div>
        <div className='h-10 w-36 bg-gray-200 rounded-full animate-pulse'></div>
      </div>
      <LoadingSpinner />
    </div>
  );
}
