'use client';

import { useState } from 'react';
import { MarkdownPreview } from './markdown-preview';
import { NoteEditorHeader, NoteEditorFooter } from './note-editor-controls';

interface NoteEditorProps {
  title: string;
  content: string;
  onSave: (title: string, content: string) => void;
  onClose: () => void;
  isEditing?: boolean;
}

export function NoteEditor({
  title: initialTitle,
  content: initialContent,
  onSave,
  onClose,
  isEditing = false,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(title, content);
    } catch (error) {
      setError('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  const togglePreview = () => setIsPreview(!isPreview);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 sm:p-6 overflow-auto'>
      <div className='bg-white rounded-xl shadow-xl w-[92%] md:w-full h-auto min-h-[50vh] max-h-[90vh] sm:max-h-[90vh] sm:h-auto sm:max-w-6xl sm:mx-4 my-auto flex flex-col'>
        <NoteEditorHeader
          title={title}
          setTitle={setTitle}
          isPreview={isPreview}
          togglePreview={togglePreview}
          onClose={onClose}
        />

        <div className='flex-1 p-4 sm:p-6 overflow-auto'>
          {isPreview ? (
            <MarkdownPreview content={content} />
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Start writing in markdown...'
              className='w-full h-full min-h-[200px] sm:min-h-[300px] text-base text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none'
            />
          )}
        </div>

        {error && (
          <div className='px-4 sm:px-6 text-red-500 text-sm'>{error}</div>
        )}

        <NoteEditorFooter
          isPreview={isPreview}
          onClose={onClose}
          onSave={handleSave}
          isEditing={isEditing}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
