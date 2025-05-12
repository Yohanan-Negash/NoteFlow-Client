'use client';

import { useState, useEffect } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { getQuickNotes, createQuickNote } from '@/lib/actions/quicknote';
import { QuickNote } from '@/lib/types';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';

function TimeRemaining({ expiresAt }: { expiresAt: string }) {
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

function QuickNoteList({ notes }: { notes: QuickNote[] }) {
  if (notes.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-gray-400'>
        <span className='text-lg mb-2'>No quick notes yet</span>
        <span className='text-sm'>Create a quick note to get started!</span>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {notes.map((note, idx) => (
        <div
          key={idx}
          className='border border-blue-100 rounded-xl bg-white shadow-sm p-6 flex flex-col gap-2'
        >
          <div className='whitespace-pre-wrap text-gray-800 text-base'>
            {note.content}
          </div>
          <div className='text-xs text-gray-400 mt-2 flex justify-end'>
            <TimeRemaining expiresAt={note.expires_at} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function QuickNotePage() {
  const [notes, setNotes] = useState<QuickNote[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNotesLoading, setIsNotesLoading] = useState(true);

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!content.trim()) {
      setError('Note cannot be empty');
      return;
    }
    setIsLoading(true);
    try {
      const newNote = await createQuickNote(content);
      if (newNote.error) {
        setError(newNote.error);
      } else {
        setNotes((prev) => [newNote, ...prev]);
        setContent('');
        setShowModal(false);
      }
    } catch (err) {
      setError('Failed to create note');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchNotes = async () => {
      setIsNotesLoading(true);
      try {
        const fetchedNotes = await getQuickNotes();
        if (Array.isArray(fetchedNotes)) {
          setNotes(fetchedNotes);
        }
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      } finally {
        setIsNotesLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold text-blue-700'>Quick Notes</h2>
        <button
          className='flex items-center gap-2 rounded-full border border-blue-200 bg-white text-blue-700 font-semibold px-5 py-2 shadow-sm hover:bg-blue-50 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200'
          onClick={() => setShowModal(true)}
        >
          <IconPlus size={20} />
          New Quick Note
        </button>
      </div>

      <p className='text-sm text-gray-500 mb-6'>
        Quick notes are automatically deleted after 24 hours.
      </p>

      {isNotesLoading ? <LoadingSpinner /> : <QuickNoteList notes={notes} />}

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
          <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-lg mx-4'>
            <h3 className='text-lg font-bold text-blue-700 mb-4'>
              New Quick Note
            </h3>
            <form onSubmit={handleCreateNote} className='flex flex-col gap-4'>
              <textarea
                className='border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-600 min-h-[120px] resize-vertical'
                placeholder='Write your quick note...'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isLoading}
              />
              <div className='text-xs text-gray-500'>
                This note will expire in 24 hours.
              </div>
              {error && <div className='text-red-500 text-sm'>{error}</div>}
              <div className='flex gap-2 justify-end'>
                <button
                  type='button'
                  className='px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200'
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
