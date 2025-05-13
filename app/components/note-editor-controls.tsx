'use client';

import {
  IconX,
  IconEdit,
  IconEyeCheck,
  IconLoader2,
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
        <div className='flex rounded-full bg-gray-100 p-1'>
          <button
            onClick={isPreview ? togglePreview : undefined}
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              !isPreview
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            title='Edit mode'
            type='button'
          >
            Edit
          </button>
          <button
            onClick={!isPreview ? togglePreview : undefined}
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              isPreview
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
            title='Preview mode'
            type='button'
          >
            Preview
          </button>
        </div>
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
  isSaving?: boolean;
}

export function NoteEditorFooter({
  isPreview,
  onClose,
  onSave,
  isEditing,
  isSaving = false,
}: NoteEditorFooterProps) {
  return (
    <div className='p-4 sm:p-6 border-t border-gray-100 flex justify-between items-center'>
      <div className='flex items-center'>
        <span className='text-xs sm:text-sm text-gray-500'>
          Use markdown for formatting
        </span>
      </div>
      <div className='flex gap-2'>
        <button
          onClick={onClose}
          className='px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-full border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200'
          type='button'
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className='px-3 py-1.5 sm:px-4 sm:py-2 text-sm rounded-full border border-blue-600 bg-blue-600 text-white font-medium hover:bg-white hover:text-blue-700 hover:border-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 flex items-center gap-1.5'
          type='button'
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <IconLoader2 size={16} className='animate-spin' />
              <span>{isEditing ? 'Saving...' : 'Creating...'}</span>
            </>
          ) : isEditing ? (
            'Save Changes'
          ) : (
            'Create Note'
          )}
        </button>
      </div>
    </div>
  );
}
