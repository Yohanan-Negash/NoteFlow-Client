'use client';

import { useState, useTransition } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { NoteEditor } from '@/app/components/note-editor';
import { createNote } from '@/lib/actions/notes';
import { useRouter } from 'next/navigation';
import { Note } from '@/lib/types';

interface CreateNoteButtonProps {
  notebookId: string;
  onNoteCreated?: (note: Note) => void;
}

export function CreateNoteButton({
  notebookId,
  onNoteCreated,
}: CreateNoteButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleSaveNote(title: string, content: string) {
    setError('');

    try {
      const newNote = await createNote(notebookId, title, content);

      if (newNote) {
        // Close the editor
        setIsCreating(false);

        // Update the parent component's state with the new note
        if (onNoteCreated) {
          onNoteCreated(newNote);
        }

        // The server action now handles path revalidation
        // We no longer need to refresh the page as the state is updated directly
      } else {
        setError('Failed to create note');
      }
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note');
    }
  }

  return (
    <>
      <button
        onClick={() => setIsCreating(true)}
        className='flex items-center gap-2 rounded-full border border-blue-200 bg-white text-blue-700 font-semibold px-5 py-2 shadow-sm hover:bg-blue-50 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200'
        disabled={isPending}
      >
        <IconPlus size={20} />
        Create Note
      </button>

      {isCreating && (
        <NoteEditor
          title=''
          content=''
          onSave={handleSaveNote}
          onClose={() => {
            setIsCreating(false);
            setError('');
          }}
          isEditing={false}
        />
      )}

      {error && (
        <div className='fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded shadow-md z-50'>
          {error}
          <button
            className='ml-2 text-red-500 font-bold'
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
