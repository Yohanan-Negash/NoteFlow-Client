'use client';

import React, { useState, useEffect } from 'react';
import { getNotebook } from '@/lib/actions/notebook';
import { getNotes } from '@/lib/actions/notes';
import { useParams, useRouter } from 'next/navigation';
import NoteList from './note-list';
import { CreateNoteButton } from './create-note-button';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import { Note } from '@/lib/types';

export default function NotebookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [notebook, setNotebook] = useState<{ id: string; name: string } | null>(
    null
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      router.push('/home');
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const notebookData = await getNotebook(id);

        if (!notebookData) {
          router.push('/home');
          return;
        }

        setNotebook(notebookData);

        const notesData = await getNotes(id);
        setNotes(notesData || []);
      } catch (err) {
        console.error('Error fetching notebook data:', err);
        setError('Failed to load notebook');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  const handleNoteCreated = (note: Note) => {
    setNotes((prevNotes) => [note, ...prevNotes]);
  };

  if (error) {
    return <div className='p-8 text-center text-red-500'>{error}</div>;
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!notebook) {
    return null;
  }

  return (
    <div className='max-w-7xl mx-auto py-10 px-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-blue-700'>{notebook.name}</h1>
        <CreateNoteButton notebookId={id} onNoteCreated={handleNoteCreated} />
      </div>

      <NoteList notes={notes} setNotes={setNotes} notebookId={id} />
    </div>
  );
}
