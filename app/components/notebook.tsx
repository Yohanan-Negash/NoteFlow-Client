'use client';

import { useState } from 'react';
import { IconTrash, IconPencil } from '@tabler/icons-react';

interface NotebookProps {
  id: number;
  name: string;
  onDelete: () => Promise<void> | void;
  onUpdate?: (newName: string) => Promise<void> | void;
  onClick?: () => void;
}

export function Notebook({ name, onDelete, onUpdate, onClick }: NotebookProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editError, setEditError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditError('');
    if (!editName.trim()) {
      setEditError('Name is required');
      return;
    }
    setIsUpdating(true);
    try {
      if (onUpdate) await onUpdate(editName);
      setShowEdit(false);
    } catch {
      setEditError('Failed to update.');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    setDeleteError('');
    setIsDeleting(true);
    try {
      await onDelete();
    } catch {
      setDeleteError('Failed to delete.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className='flex flex-col justify-between border border-blue-100 rounded-xl bg-primary shadow-sm p-6 min-h-[220px] transition-transform hover:scale-105 hover:shadow-md cursor-pointer group relative'
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => {
        setShowDelete(false);
        setConfirm(false);
      }}
      onClick={() => {
        if (!showDelete && !showEdit && onClick) onClick();
      }}
    >
      <div className='flex-1 flex items-center justify-center text-2xl font-bold text-secondary text-center mb-4'>
        {name}
      </div>
      <div className='text-xs text-foreground text-center mt-2'>Notebook</div>
      {showDelete && !confirm && (
        <>
          <button
            className='absolute top-3 right-3 p-2 rounded-full bg-primary border border-blue-100 shadow hover:bg-red-50 hover:text-red-600 transition-colors text-red-700'
            onClick={(e) => {
              e.stopPropagation();
              setConfirm(true);
            }}
            aria-label='Delete notebook'
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className='text-xs'>...</span>
            ) : (
              <IconTrash size={18} />
            )}
          </button>
          <button
            className='absolute top-3 left-3 p-2 rounded-full bg-primary border border-blue-100 shadow hover:bg-blue-50 hover:text-secondary transition-colors text-secondary'
            onClick={(e) => {
              e.stopPropagation();
              setShowEdit(true);
              setEditName(name);
              setEditError('');
            }}
            aria-label='Edit notebook'
            disabled={isUpdating}
          >
            {isUpdating ? (
              <span className='text-xs'>...</span>
            ) : (
              <IconPencil size={18} />
            )}
          </button>
        </>
      )}
      {showDelete && confirm && (
        <div className='absolute top-3 right-3 bg-primary border border-blue-100 rounded shadow p-2 flex flex-col items-center gap-1'>
          <span className='text-xs text-foreground mb-1'>Delete?</span>
          <div className='flex gap-1'>
            <button
              className='px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700'
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes'}
            </button>
            <button
              className='px-2 py-1 text-xs rounded bg-gray-100 text-foreground hover:bg-gray-200'
              onClick={(e) => {
                e.stopPropagation();
                setConfirm(false);
              }}
              disabled={isDeleting}
            >
              No
            </button>
          </div>
          {deleteError && (
            <div className='text-red-500 text-xs mt-1'>{deleteError}</div>
          )}
        </div>
      )}
      {showEdit && (
        <div className='absolute inset-0 z-10 flex items-center justify-center bg-black/10'>
          <form
            className='bg-primary border border-blue-100 rounded-xl shadow-xl p-4 flex flex-col gap-3 w-full max-w-xs mx-auto'
            onSubmit={handleEditSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              className='border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-secondary'
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              autoFocus
              disabled={isUpdating}
            />
            {editError && (
              <div className='text-red-500 text-xs'>{editError}</div>
            )}
            <div className='flex gap-2 justify-end'>
              <button
                type='button'
                className='px-3 py-1 rounded-lg bg-gray-100 text-foreground hover:bg-gray-200 text-xs'
                onClick={() => setShowEdit(false)}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-3 py-1 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-xs'
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
