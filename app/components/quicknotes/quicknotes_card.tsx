import { QuickNote } from '@/lib/types';
import { TimeRemaining } from './quicknote_form';
import { purgeExpiredQuickNotes } from '@/lib/actions/quicknote';

interface QuickNotesCardProps {
  quicknote: QuickNote;
}

export default async function QuickNotesCard({
  quicknote,
}: QuickNotesCardProps) {
  if (new Date(quicknote.expires_at).getTime() < Date.now()) {
    await purgeExpiredQuickNotes();
    return null;
  }

  return (
    <div className='border border-blue-100 rounded-xl bg-white shadow-sm p-6 flex flex-col gap-2'>
      <div className='whitespace-pre-wrap text-gray-800 text-base'>
        {quicknote.content}
      </div>
      <div className='text-xs text-gray-400 mt-2 flex justify-end'>
        <TimeRemaining expiresAt={quicknote.expires_at} />
      </div>
    </div>
  );
}
