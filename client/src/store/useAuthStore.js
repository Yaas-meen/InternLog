import { create } from 'zustand';
import axiosClient from '../api/axiosClient';

export const useAuthStore = create((set, get) => ({
  user:        null,
  accessToken: null,
  isLoading:   false,
  error:       null,

  //  Setters 
  setAccessToken: (token) => set({ accessToken: token }),

  clearAuth: () => set({ user: null, accessToken: null, error: null }),

  //  Register 
  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosClient.post('/auth/register', data);
      const { accessToken, user } = res.data.data;
      set({ user, accessToken, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  //  Login 
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosClient.post('/auth/login', { email, password });
      const { accessToken, user } = res.data.data;
      set({ user, accessToken, isLoading: false });
      return { success: true, role: user.role };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  //  Logout 
  logout: async () => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      set({ user: null, accessToken: null, error: null });
    }
  },

  //  Refresh user on page reload 
  refreshUser: async () => {
    set({ isLoading: true });
    try {
      const res      = await axiosClient.post('/auth/refresh');
      const { accessToken, user } = res.data.data;
      set({ user, accessToken, isLoading: false });
      return true;
    } catch {
      set({ user: null, accessToken: null, isLoading: false });
      return false;
    }
  },

  //  Helpers 
  isIntern: () => get().user?.role === 'intern',
  isAdmin:  () => get().user?.role === 'admin',
}));