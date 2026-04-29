// Authentication utilities for the frontend

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Get the current authentication state
export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false };
  }

  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('auth_user');

  if (!token) {
    return { user: null, token: null, isAuthenticated: false };
  }

  let user: User | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  return {
    user,
    token,
    isAuthenticated: !!token && !!user
  };
}

// Set authentication state
export function setAuthState(token: string, user: User): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  } catch (error) {
    // Silent fail in production
  }
}

// Clear authentication state (logout)
export function clearAuthState(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

// Get authorization header for API requests
export function getAuthHeader(): { Authorization: string } | {} {
  const { token } = getAuthState();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getAuthState().isAuthenticated;
}

// Get current user
export function getCurrentUser(): User | null {
  return getAuthState().user;
}

// Redirect to login if not authenticated
export function requireAuth(): void {
  if (!isAuthenticated()) {
    window.location.href = '/auth';
  }
}
