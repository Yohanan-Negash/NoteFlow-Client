'use client';

import { useState, useEffect } from 'react';
import { Notebook as NotebookComponent } from './notebook';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import {
  getNotebooks,
  createNotebook,
  deleteNotebook,
  updateNotebook,
} from '@/lib/actions/notebook';
import { Notebook } from '@/lib/types';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';

export default function NotebookList() {
  const router = useRouter();
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotebooksLoading, setIsNotebooksLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotebooks = async () => {
      setIsNotebooksLoading(true);
      try {
        const fetchedNotebooks = await getNotebooks();
        if (Array.isArray(fetchedNotebooks)) {
          setNotebooks(fetchedNotebooks);
        }
      } catch (err) {
        console.error('Failed to fetch notebooks:', err);
      } finally {
        setIsNotebooksLoading(false);
      }
    };

    fetchNotebooks();
  }, []);

  async function handleCreateNotebook(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setIsLoading(true);
    try {
      const newNotebook = await createNotebook(name);
      if (newNotebook) {
        setNotebooks((prev) => [...prev, newNotebook]);
        setName('');
        setShowModal(false);
      } else {
        setError('Failed to create notebook');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteNotebook(id: string) {
    try {
      const success = await deleteNotebook(id);
      if (success) {
        setNotebooks((prev) =>
          prev.filter((notebook) => notebook.id.toString() !== id)
        );
      }
    } catch (err) {
      console.error('Error deleting notebook:', err);
    }
  }

  async function handleUpdateNotebook(id: string, newName: string) {
    try {
      const updatedNotebook = await updateNotebook(id, newName);
      if (updatedNotebook) {
        setNotebooks((prev) =>
          prev.map((notebook) =>
            notebook.id.toString() === id
              ? { ...notebook, name: newName }
              : notebook
          )
        );
      }
    } catch (err) {
      console.error('Error updating notebook:', err);
    }
  }

  return (
    <div className='w-full'>
      <div className='flex justify-end mb-6'>
        <button
          className='flex items-center gap-2 rounded-full border border-blue-200 bg-white text-blue-700 font-semibold px-5 py-2 shadow-sm hover:bg-blue-50 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200'
          onClick={() => setShowModal(true)}
        >
          <IconPlus size={20} />
          Create Notebook
        </button>
      </div>

      {isNotebooksLoading ? (
        <LoadingSpinner />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full'>
          {notebooks.length === 0 ? (
            <div className='col-span-full flex flex-col items-center justify-center py-24 text-gray-400'>
              <span className='text-lg mb-2'>No notebooks yet</span>
              <span className='text-sm'>Create a notebook to get started!</span>
            </div>
          ) : (
            notebooks.map((notebook) => (
              <div
                key={notebook.id}
                onClick={() => router.push(`/home/${notebook.id}`)}
              >
                <NotebookComponent
                  id={notebook.id}
                  name={notebook.name}
                  onDelete={() => handleDeleteNotebook(notebook.id.toString())}
                  onUpdate={(newName) =>
                    handleUpdateNotebook(notebook.id.toString(), newName)
                  }
                />
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30'>
          <div className='bg-white rounded-xl shadow-xl p-8 w-full max-w-sm mx-4'>
            <h3 className='text-lg font-bold text-blue-700 mb-4'>
              Create Notebook
            </h3>
            <form
              onSubmit={handleCreateNotebook}
              className='flex flex-col gap-4'
            >
              <input
                className='border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-600'
                placeholder='Notebook name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
              {error && <div className='text-red-500 text-sm'>{error}</div>}
              <div className='flex gap-2 justify-end'>
                <button
                  type='button'
                  className='px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200'
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                    setName('');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-60'
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
