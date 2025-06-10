'use client';

import { useState, useEffect } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { QuickNote } from '@/lib/types';

export function TimeRemaining({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    function updateTimeLeft() {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diffMs = expiry.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m remaining`);
    }

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expiresAt]);

  return <span className='font-medium text-amber-600'>{timeLeft}</span>;
}

interface QuickNoteFormProps {
  createAction: (content: string) => Promise<QuickNote[] | { error: string }>;
}

// Type guard function to check if the result has an error property
function isErrorResult(
  result: QuickNote[] | { error: string }
): result is { error: string } {
  return 'error' in result;
}

export function QuickNoteForm({ createAction }: QuickNoteFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Note cannot be empty');
      return;
    }

    setIsLoading(true);

    try {
      const result = await createAction(content);

      if (isErrorResult(result)) {
        setError(result.error);
      } else {
        setContent('');
        setShowModal(false);
        // Refresh the page to show the new note
        window.location.reload();
      }
    } catch {
      setError('Failed to create note');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        className='flex items-center gap-2 rounded-full border border-blue-200 bg-primary text-secondary font-semibold px-5 py-2 shadow-sm hover:bg-blue-50 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200'
        onClick={() => setShowModal(true)}
      >
        <IconPlus size={20} />
        New Quick Note
      </button>

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
          <div className='bg-primary rounded-xl shadow-xl p-8 w-full max-w-lg mx-4'>
            <h3 className='text-lg font-bold text-secondary mb-4'>
              New Quick Note
            </h3>
            <form onSubmit={handleCreateNote} className='flex flex-col gap-4'>
              <textarea
                className='border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-secondary min-h-[120px] resize-vertical'
                placeholder='Write your quick note...'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
              />
              <div className='text-xs text-foreground'>
                This note will expire in 24 hours.
              </div>
              {error && <div className='text-red-500 text-sm'>{error}</div>}
              <div className='flex gap-2 justify-end'>
                <button
                  type='button'
                  className='px-4 py-2 rounded-lg bg-gray-100 text-red-500 hover:bg-gray-200'
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                    setContent('');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-60'
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
