'use server';

import { Note } from '../types';
import { getAuthToken } from './auth';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getNotes(notebookId: string) {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in getNotes');
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/notebooks/${notebookId}/notes`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch notes:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return null;
  }
}

export async function createNote(
  notebookId: string,
  title: string,
  content: string
) {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in createNote');
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/notebooks/${notebookId}/notes`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: { title, content } }),
      }
    );

    if (!response.ok) {
      console.error('Failed to create note:', response.statusText);
      return null;
    }

    const data = await response.json();

    // Revalidate the path to trigger a refresh of the server components
    // This ensures that the new note appears immediately without manual refresh
    revalidatePath(`/home/${notebookId}`);

    return data;
  } catch (error) {
    console.error('Error creating note:', error);
    return null;
  }
}

export async function getNote(notebookId: string, noteId: string) {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in getNote');
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/notebooks/${notebookId}/notes/${noteId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch note:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
}

export async function updateNote(
  notebookId: string,
  noteId: string,
  title: string,
  content: string
) {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in updateNote');
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/notebooks/${notebookId}/notes/${noteId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ note: { title, content } }),
      }
    );

    if (!response.ok) {
      console.error('Failed to update note:', response.statusText);
      return null;
    }

    const data = await response.json();

    // Also revalidate the path when updating a note
    revalidatePath(`/home/${notebookId}`);

    return data;
  } catch (error) {
    console.error('Error updating note:', error);
    return null;
  }
}

export async function deleteNote(notebookId: string, noteId: string) {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in deleteNote');
    return null;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/notebooks/${notebookId}/notes/${noteId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to delete note:', response.statusText);
      return null;
    }

    // Also revalidate the path when deleting a note
    revalidatePath(`/home/${notebookId}`);

    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
}
