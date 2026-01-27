import api from './api';
import type { AuthResponse, User, UpdateProfileData } from '../types';

export const authService = {
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async socialLogin(data: {
    email: string;
    name?: string;
    googleId?: string;
    facebookId?: string;
    appleId?: string;
    avatar?: string;
    token?: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/social', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData): Promise<void> {
    await api.put('/auth/me', data);
  },

  saveTokens(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};
