import { Suspense } from 'react';
import { getQuickNotes, createQuickNote } from '@/lib/actions/quicknote';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import { QuickNoteForm } from '@/app/components/quicknotes/quicknote_form';
import QuickNotesList from '@/app/components/quicknotes/quicknotes_list';
import { QuickNote } from '@/lib/types';

// Type guard to check if the result is an error
function isError(
  result: QuickNote[] | { error: string }
): result is { error: string } {
  return 'error' in result;
}

export default async function QuickNotePage() {
  const quickNotesResult = await getQuickNotes();

  // Handle potential error
  const quick_notes = isError(quickNotesResult) ? [] : quickNotesResult;

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold text-blue-700'>Quick Notes</h2>
        <QuickNoteForm createAction={createQuickNote} />
      </div>

      <p className='text-sm text-gray-500 mb-6'>
        Quick notes are automatically deleted after 24 hours.
      </p>

      {isError(quickNotesResult) && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
          {quickNotesResult.error}
        </div>
      )}

      <Suspense
        fallback={
          <div className='flex flex-col items-center justify-center py-12'>
            <LoadingSpinner />
            <p className='text-gray-500 mt-4'>Loading quick notes...</p>
          </div>
        }
      >
        <QuickNotesList quick_notes={quick_notes} />
      </Suspense>
    </>
  );
}
