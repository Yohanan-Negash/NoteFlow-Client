'use server';

import { getAuthToken } from './auth';
import { Notebook } from '../types';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getNotebooks(): Promise<Notebook[]> {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in getNotebooks');
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/notebooks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notebooks:', error);
    return [];
  }
}

export async function createNotebook(name: string) {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in createNotebook');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/notebooks`, {
      method: 'POST',
      body: JSON.stringify({ notebook: { name } }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to create notebook:', response.statusText);
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating notebook:', error);
    return null;
  }
}

export async function deleteNotebook(id: string) {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in deleteNotebook');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/notebooks/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to delete notebook:', response.statusText);
      return;
    }

    return true;
  } catch (error) {
    console.error('Error deleting notebook:', error);
    return false;
  }
}

export async function getNotebook(id: string) {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in getNotebook');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/notebooks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to get notebook:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting notebook:', error);
    return null;
  }
}

export async function updateNotebook(id: string, name: string) {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in updateNotebook');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/notebooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ notebook: { name } }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to update notebook:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating notebook:', error);
    return null;
  }
}

export async function getNotebookNotes(id: string) {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in getNotebookNotes');
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/notebooks/${id}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to get notebook notes:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting notebook notes:', error);
    return [];
  }
     