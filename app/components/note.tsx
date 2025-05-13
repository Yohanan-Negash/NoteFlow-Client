'use client';

import { useState, useTransition } from 'react';
import { IconTrash, IconPencil } from '@tabler/icons-react';
import { NoteEditor } from './note-editor';
import { useRouter } from 'next/navigation';

interface NoteProps {
  id: number;
  title: string;
  content: string;
  onDelete: () => Promise<void> | void;
  onUpdate?: (editedNote: {
    title: string;
    content: string;
  }) => Promise<void> | void;
}

export function Note({ title, content, onDelete, onUpdate }: NoteProps) {
  const [showActions, setShowActions] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDelete() {
    setError('');
    setIsDeleting(true);
    try {
      await onDelete();
    } catch {
      setError('Failed to delete note.');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEditClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  }

  async function handleSaveNote(editedTitle: string, editedContent: string) {
    setError('');
    if (!onUpdate) return;

    try {
      // First, update the note
      await onUpdate({
        title: editedTitle,
        content: editedContent,
      });

      // Close the editor after a successful update
      setIsEditing(false);

      // Per documentation: router.refresh completely clears the Router Cache
      // and makes a new request to the server for the current route
      // This is the proper way to refresh data after mutations
      startTransition(() => {
        router.refresh();
      });

      return Promise.resolve();
    } catch (err) {
      console.error('Failed to update note:', err);
      setError('Failed to update note');
      return Promise.reject(err);
    }
  }

  return (
    <>
      <div
        className='flex flex-col justify-between border border-blue-100 rounded-xl bg-white shadow-sm p-6 min-h-[220px] transition-transform hover:scale-105 hover:shadow-md group relative'
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => {
          if (!confirm) {
            setShowActions(false);
          }
        }}
      >
        <div className='flex-1 flex flex-col'>
          <h3 className='text-xl font-bold text-blue-700 mb-2'>{title}</h3>
          <div className='text-gray-600 line-clamp-3'>{content}</div>
        </div>
        <div className='text-xs text-gray-400 text-center mt-2'>Note</div>

        {showActions && !confirm && (
          <>
            <button
              className='absolute top-3 right-3 p-2 rounded-full bg-white border border-blue-100 shadow hover:bg-red-50 hover:text-red-600 transition-colors text-red-700 z-10'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConfirm(true);
              }}
              aria-label='Delete note'
              disabled={isDeleting || isPending}
            >
              {isDeleting ? (
                <span className='text-xs'>...</span>
              ) : (
                <IconTrash size={18} />
              )}
            </button>
            <button
              className='absolute top-3 left-3 p-2 rounded-full bg-white border border-blue-100 shadow hover:bg-blue-50 hover:text-blue-600 transition-colors text-blue-700 z-10'
              onClick={handleEditClick}
              aria-label='Edit note'
              disabled={isPending}
            >
              <IconPencil size={18} />
            </button>
          </>
        )}

        {confirm && (
          <div className='absolute top-3 right-3 bg-white border border-blue-100 rounded shadow p-2 flex flex-col items-center gap-1 z-20'>
            <span className='text-xs text-gray-700 mb-1'>Delete?</span>
            <div className='flex gap-1'>
              <button
                className='px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes'}
              </button>
              <button
                className='px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirm(false);
                }}
                disabled={isDeleting}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>

      {isEditing && (
        <NoteEditor
          title={title}
          content={content}
          onSave={handleSaveNote}
          onClose={() => {
            setIsEditing(false);
            setError('');
          }}
          isEditing={true}
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
