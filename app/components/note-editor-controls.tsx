'use client';

import {
  IconEye,
  IconEyeOff,
  IconX,
  IconEdit,
  IconEyeCheck,
} from '@tabler/icons-react';

interface NoteEditorHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  isPreview: boolean;
  togglePreview: () => void;
  onClose: () => void;
}

export function NoteEditorHeader({
  title,
  setTitle,
  isPreview,
  togglePreview,
  onClose,
}: NoteEditorHeaderProps) {
  return (
    <div className='flex items-center justify-between p-4 sm:p-6 border-b border-gray-100'>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Note title'
        className='text-xl sm:text-2xl font-bold text-blue-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full'
      />
      <div className='flex items-center gap-2'>
        <button
          onClick={togglePreview}
          className='p-2 rounded-full border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-colors text-gray-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
          title={isPreview ? 'Edit mode' : 'Preview mode'}
          type='button'
        >
          {isPreview ? <IconEyeOff size={20} /> : <IconEye size={20} />}
        </button>
        <button
          onClick={onClose}
          className='p-2 rounded-full border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-colors text-gray-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200'
          type='button'
        >
          <IconX size={20} />
        </button>
      </div>
    </div>
  );
}

interface NoteEditorFooterProps {
  isPreview: boolean;
  onClose: () => void;
  onSave: () => void;
  isEditing: boolean;
}

export function NoteEditorFooter({
  isPreview,
  onClose,
  onSave,
  isEditing,
}: NoteEditorFooterProps) {
  return (
    <div className='p-4 sm:p-6 border-t border-gray-100 flex justify-between items-center'>
      <div className='flex items-center gap-2'>
        <div
          className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm
          ${
            isPreview
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-gray-50 text-gray-700 border border-gray-200'
          }
        `}
        >
          {isPreview ? (
            <IconEyeCheck size={16} className='text-blue-600' />
          ) : (
            <IconEdit size={16} className='text-gray-600' />
          )}
          <span className='font-medium'>
            {isPreview ? 'Preview mode' : 'Edit mode'}
          </span>
        </div>
        <span className='text-xs sm:text-sm text-gray-500 hidden sm:inline'>
          • Use markdown for formatting
        </span>
      </div>
      <div className='flex gap-2'>
        <button
          onClick={onClose}
          className='px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-full border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200'
          type='button'
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className='px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-full border border-blue-600 bg-blue-600 text-white font-medium hover:bg-white hover:text-blue-700 hover:border-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200'
          type='button'
        >
          {isEditing ? 'Save Changes' : 'Create Note'}
        </button>
      </div>
    </div>
  );
}
