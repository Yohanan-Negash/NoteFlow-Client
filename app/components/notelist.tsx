'use client';

import { Note as NoteComponent } from './note';
import { Note } from '@/lib/types';

interface NoteListProps {
  notes: Note[];
  onUpdate: (note: Note) => void;
  onDelete: (id: number) => void;
}

export function NoteList({ notes, onUpdate, onDelete }: NoteListProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full'>
      {notes.map((note) => (
        <NoteComponent
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
          onUpdate={(editedNote) => onUpdate({ ...note, ...editedNote })}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </div>
  );
}
