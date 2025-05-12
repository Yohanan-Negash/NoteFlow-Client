export interface User {
  id: string;
  email_address: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email_address: string;
  password: string;
}

export interface RegisterCredentials {
  email_address: string;
  password: string;
  password_confirmation: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string | string[];
}
