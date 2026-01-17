import { apiClient } from '~/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const login = async (
  email: string,
  password: string
): Promise<User> => {
  const response = await apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Invalid credentials');
  }

  const data = await response.json();
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data.user;
};

export const register = async (registerData: RegisterData): Promise<User> => {
  const response = await apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(registerData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const data = await response.json();
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data.user;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('token');
};
                                                                                        