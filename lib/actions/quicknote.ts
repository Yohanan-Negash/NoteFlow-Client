'use server';
import { QuickNote } from '../types';
import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getQuickNotes(): Promise<
  QuickNote[] | { error: string }
> {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in getQuickNotes');
    return { error: 'Authentication failed' };
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/quick_notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getQuickNotes', error);
    return { error: 'Failed to get notes' };
  }
}

export async function createQuickNote(
  content: string
): Promise<QuickNote[] | { error: string }> {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in createQuickNote');
    return { error: 'No token found' };
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/quick_notes`, {
      method: 'POST',
      body: JSON.stringify({ quick_note: { content } }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in createQuickNote', error);
    return { error: 'Failed to create quick note' };
  }
}

export async function purgeExpiredQuickNotes(): Promise<
  { success: true } | { error: string }
> {
  const token = await getAuthToken();

  if (!token) {
    console.error('No token found in purgeExpiredQuickNotes');
    return { error: 'Authentication failed' };
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/quick_notes/purge_expired`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );
    if (response.ok || response.status === 202) {
      return { success: true };
    } else {
      const data = await response.json();
      return { error: data.error || 'Failed to purge expired quick notes' };
    }
  } catch (error) {
    console.error('Error in purgeExpiredQuickNotes', error);
    return { error: 'Failed to purge expired quick notes' };
  }
}
