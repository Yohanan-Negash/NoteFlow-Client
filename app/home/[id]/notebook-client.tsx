'use client';

import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { NoteList } from '@/app/components/notelist';
import { NoteEditor } from '@/app/components/note-editor';

interface NoteData {
  id: number;
  title: string;
  content: string;
}

interface NotebookClientProps {
  notebookName: string;
}

const INITIAL_NOTES: NoteData[] = [
  {
    id: 1,
    title: 'Welcome to NoteFlow',
    content:
      'This is your first note. Click the edit button to modify it or create a new note using the button below.',
  },
  {
    id: 2,
    title: 'Getting Started',
    content:
      'Learn how to use NoteFlow effectively. Create notes, organize them in notebooks, and keep your thoughts organized.',
  },
];

export function NotebookClient({ notebookName }: NotebookClientProps) {
  const [notes, setNotes] = useState<NoteData[]>(INITIAL_NOTES);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteData | null>(null);

  function handleCreateNote() {
    setIsCreating(true);
  }

  function handleSaveNote(title: string, content: string) {
    if (editingNote) {
      setNotes(
        notes.map((note) =>
          note.id === editingNote.id ? { ...note, title, content } : note
        )
      );
      setEditingNote(null);
    } else {
      setNotes([...notes, { id: Date.now(), title, content }]);
      setIsCreating(false);
    }
  }

  function handleUpdateNote(id: number, title: string, content: string) {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setEditingNote(note);
    }
  }

  function handleDeleteNote(id: number) {
    setNotes(notes.filter((note) => note.id !== id));
  }

  return (
    <div className='max-w-7xl mx-auto py-10 px-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-blue-700'>{notebookName}</h1>
        <button
          onClick={handleCreateNote}
          className='flex items-center gap-2 rounded-full border border-blue-200 bg-white text-blue-700 font-semibold px-5 py-2 shadow-sm hover:bg-blue-50 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200'
        >
          <IconPlus size={20} />
          Create Note
        </button>
      </div>

      <NoteList
        notes={notes}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
      />

      {(isCreating || editingNote) && (
        <NoteEditor
          title={editingNote?.title ?? ''}
          content={editingNote?.content ?? ''}
          onSave={handleSaveNote}
          onClose={() => {
            setIsCreating(false);
            setEditingNote(null);
          }}
          isEditing={!!editingNote}
        />
      )}
    </div>
  );
}
