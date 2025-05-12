'use client';

import { Note } from './note';

interface NoteData {
  id: number;
  title: string;
  content: string;
}

interface NoteListProps {
  notes: NoteData[];
  onUpdate: (id: number, title: string, content: string) => void;
  onDelete: (id: number) => void;
}

export function NoteList({ notes, onUpdate, onDelete }: NoteListProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full'>
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
          onUpdate={(title, content) => onUpdate(note.id, title, content)}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </div>
  );
}
