'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/lib/types';

// Cookie configuration
const TOKEN_COOKIE_NAME = 'auth_token';
const USER_COOKIE_NAME = 'auth_user';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
  sameSite: 'lax' as const,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Define proper types for auth actions
interface AuthState {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function login(
  prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const email_address = formData.get('email_address') as string;
  const password = formData.get('password') as string;

  if (!email_address || !password) {
    return {
      success: false,
      error: 'Email and password are required',
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address, password }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Login failed',
      };
    }

    if (data.data?.token) {
      // Store the token in a cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: TOKEN_COOKIE_NAME,
        value: data.data.token,
        ...COOKIE_OPTIONS,
      });

      // Store the user data in a separate cookie
      if (data.data.user) {
        cookieStore.set({
          name: USER_COOKIE_NAME,
          value: JSON.stringify(data.data.user),
          ...COOKIE_OPTIONS,
        });
      }

      return { success: true, redirectTo: '/home' };
    }

    return { success: false, error: 'Authentication failed' };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || 'An unexpected error occurred',
    };
  }
}

export async function register(
  prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  const email_address = formData.get('email_address') as string;
  const password = formData.get('password') as string;
  const password_confirmation = formData.get('password_confirmation') as string;

  if (!email_address || !password || !password_confirmation) {
    return {
      success: false,
      error: 'All fields are required',
    };
  }

  if (password !== password_confirmation) {
    return {
      success: false,
      error: 'Passwords do not match',
    };
  }

  try {
    const response = await fetch(`${API_URL}/api/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address, password, password_confirmation }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof data.error === 'string'
          ? data.error
          : Array.isArray(data.error)
          ? data.error.join(', ')
          : 'Registration failed';

      return { success: false, error: errorMessage };
    }

    if (data.data?.token) {
      // Store the token in a cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: TOKEN_COOKIE_NAME,
        value: data.data.token,
        ...COOKIE_OPTIONS,
      });

      // Store the user data in a separate cookie
      if (data.data.user) {
        cookieStore.set({
          name: USER_COOKIE_NAME,
          value: JSON.stringify(data.data.user),
          ...COOKIE_OPTIONS,
        });
      }

      return { success: true, redirectTo: '/home' };
    }

    return { success: false, error: 'Registration failed' };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || 'An unexpected error occurred',
    };
  }
}

export async function logout() {
  const token = await getAuthToken();

  if (token) {
    try {
      await fetch(`${API_URL}/api/v1/logout`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Clear both cookies
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
  cookieStore.delete(USER_COOKIE_NAME);

  redirect('/');
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

export async function getUser(): Promise<User | null> {
  // Get user data from cookie
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_COOKIE_NAME)?.value;

  if (userCookie) {
    try {
      return JSON.parse(userCookie) as User;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }

  // If no user cookie exists, we'll need to fetch user data
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  // Since there's no /current_user endpoint yet, we return null
  // When the endpoint is added, we can implement the fetch
  return null;
}
