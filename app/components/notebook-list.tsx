'use client';

import { useState } from 'react';
import { Notebook } from './notebook';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const INITIAL_NOTEBOOKS = [
  { id: 1, name: 'Projects' },
  { id: 2, name: 'Learnings' },
  { id: 3, name: 'Something else' },
];

export default function NotebookList() {
  const router = useRouter();
  const [notebooks, setNotebooks] = useState(INITIAL_NOTEBOOKS);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleCreateNotebook(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      // Simulate API call
      if (name.toLowerCase() === 'error') {
        setError('Something went wrong');
        setIsLoading(false);
        return;
      }
      const newId =
        notebooks.length > 0 ? Math.max(...notebooks.map((n) => n.id)) + 1 : 1;
      setNotebooks((prev) => [...prev, { id: newId, name }]);
      setName('');
      setIsLoading(false);
      setShowModal(false);
    }, 1200);
  }

  function handleDeleteNotebook(idx: number) {
    setNotebooks((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleUpdateNotebook(idx: number, newName: string) {
    setNotebooks((prev) =>
      prev.map((n, i) => (i === idx ? { ...n, name: newName } : n))
    );
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
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full'>
        {notebooks.map((notebook, idx) => (
          <Link key={notebook.id} href={`/home/${notebook.id}`}>
            <Notebook
              id={notebook.id}
              name={notebook.name}
              onDelete={() => handleDeleteNotebook(idx)}
              onUpdate={(newName) => handleUpdateNotebook(idx, newName)}
            />
          </Link>
        ))}
      </div>
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
