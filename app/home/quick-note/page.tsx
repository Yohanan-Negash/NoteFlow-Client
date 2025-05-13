import { Suspense } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { getQuickNotes, createQuickNote } from '@/lib/actions/quicknote';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import { QuickNoteForm } from '@/app/components/quicknotes/quicknote_form';
import QuickNotesList from '@/app/components/quicknotes/quicknotes_list';

export default async function QuickNotePage() {
  const quick_notes = await getQuickNotes();
  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-semibold text-blue-700'>Quick Notes</h2>
        <QuickNoteForm createAction={createQuickNote} />
      </div>

      <p className='text-sm text-gray-500 mb-6'>
        Quick notes are automatically deleted after 24 hours.
      </p>

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
