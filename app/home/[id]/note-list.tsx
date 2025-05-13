'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { Note } from '@/lib/types';
import { deleteNote, updateNote } from '@/lib/actions/notes';
import { NoteList as NoteListComponent } from '@/app/components/notelist';
import { NoteEditor } from '@/app/components/note-editor';

interface NoteListProps {
  notes: Note[];
  setNotes: Dispatch<SetStateAction<Note[]>>;
  notebookId: string;
  initialNotes?: Note[];
}

export default function NoteList({
  notes,
  setNotes,
  notebookId,
}: NoteListProps) {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [error, setError] = useState('');

  async function handleDeleteNote(id: number) {
    try {
      setError('');
      const success = await deleteNote(notebookId, id.toString());

      if (success) {
        // Optimistically update the UI
        setNotes((prev) => prev.filter((note) => note.id !== id));
      } else {
        setError('Failed to delete note');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
    }
  }

  function handleEditNote(note: Note) {
    setEditingNote(note);
    setError('');
  }

  async function handleSaveNote(title: string, content: string) {
    if (editingNote) {
      setError('');
      try {
        const updatedNote = await updateNote(
          notebookId,
          editingNote.id.toString(),
          title,
          content
        );

        if (updatedNote) {
          // Optimistically update UI
          setNotes((prev) =>
            prev.map((note) =>
              note.id === editingNote.id ? updatedNote : note
            )
          );
          setEditingNote(null);
        } else {
          setError('Failed to update note');
        }
      } catch (err) {
        console.error('Error updating note:', err);
        setError('Failed to update note');
      }
    }
  }

  return (
    <>
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
        </div>
      )}

      {notes.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-24 text-gray-400'>
          <span className='text-lg mb-2'>No notes yet</span>
          <span className='text-sm'>Create a note to get started!</span>
        </div>
      ) : (
        <NoteListComponent
          notes={notes}
          onUpdate={handleEditNote}
          onDelete={handleDeleteNote}
        />
      )}

      {editingNote && (
        <NoteEditor
          title={editingNote.title}
          content={editingNote.content}
          onSave={handleSaveNote}
          onClose={() => {
            setEditingNote(null);
            setError('');
          }}
          isEditing={true}
        />
      )}
    </>
  );
}
