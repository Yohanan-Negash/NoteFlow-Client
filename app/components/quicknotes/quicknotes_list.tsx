import { QuickNote } from '@/lib/types';
import QuickNotesCard from './quicknotes_card';

interface QuickNotesListProps {
  quick_notes: QuickNote[];
}

export default function QuickNotesList({ quick_notes }: QuickNotesListProps) {
  if (quick_notes.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-gray-400'>
        <span className='text-lg mb-2'>No quick notes yet</span>
        <span className='text-sm'>Create a quick note to get started!</span>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6'>
      {quick_notes.map((quicknote) => (
        <QuickNotesCard key={quicknote.id} quicknote={quicknote} />
      ))}
    </div>
  );
}
