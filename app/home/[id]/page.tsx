import { getNotebook } from '@/lib/actions/notebook';
import { getNotes } from '@/lib/actions/notes';
import { notFound } from 'next/navigation';
import NoteList from './note-list';
import { CreateNoteButton } from './create-note-button';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import { cache } from 'react';

interface NotebookPageProps {
  params: Promise<{ id: string }>;
}

// Cache notebook data fetching to avoid duplicate requests
const getNotebookData = cache(async (id: string) => {
  const notebook = await getNotebook(id);
  if (!notebook) return null;
  return notebook;
});

// Cache notes data fetching
const getNotesData = cache(async (id: string) => {
  return await getNotes(id);
});

export default async function NotebookPage({ params }: NotebookPageProps) {
  // Await params before accessing properties
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id) {
    notFound();
  }

  // Fetch notebook data
  const notebook = await getNotebookData(id);

  if (!notebook) {
    notFound();
  }

  // Fetch notes data
  const notes = await getNotesData(id);

  return (
    <div className='max-w-7xl mx-auto py-10 px-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-blue-700'>{notebook.name}</h1>
        <CreateNoteButton notebookId={id} />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <NoteList initialNotes={notes || []} notebookId={id} />
      </Suspense>
    </div>
  );
}
