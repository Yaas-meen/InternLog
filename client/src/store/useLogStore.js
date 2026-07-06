import { create } from 'zustand';
import toast      from 'react-hot-toast';
import axiosClient from '../api/axiosClient';

export const useLogStore = create((set, get) => ({
  logs:          [],
  currentLog:    null,
  weeklyReport:  null,
  monthlyReport: null,
  isLoading:     false,
  error:         null,

  clearError: () => set({ error: null }),

  createLog: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res    = await axiosClient.post('/logs', data);
      const newLog = res.data.data;
      set((state) => ({ logs: [newLog, ...state.logs], isLoading: false }));
      toast.success('Log entry created successfully');
      return { success: true, log: newLog };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create log';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  fetchMyLogs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams(filters).toString();
      const res    = await axiosClient.get(`/logs/my${params ? `?${params}` : ''}`);
      set({ logs: res.data.data, isLoading: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch logs';
      set({ error: message, isLoading: false });
    }
  },

  fetchLog: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosClient.get(`/logs/${id}`);
      set({ currentLog: res.data.data, isLoading: false });
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch log';
      set({ error: message, isLoading: false });
      toast.error(message);
      return null;
    }
  },

  updateLog: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res     = await axiosClient.patch(`/logs/${id}`, data);
      const updated = res.data.data;
      set((state) => ({
        logs:       state.logs.map((l) => (l._id === id ? updated : l)),
        currentLog: updated,
        isLoading:  false,
      }));
      toast.success('Log entry updated');
      return { success: true, log: updated };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update log';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  deleteLog: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosClient.delete(`/logs/${id}`);
      set((state) => ({
        logs:      state.logs.filter((l) => l._id !== id),
        isLoading: false,
      }));
      toast.success('Log entry deleted');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete log';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  uploadImage: async (file, logId = null) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('image', file);
      const url = logId ? `/upload/logbook/${logId}` : '/upload/logbook';
      const res = await axiosClient.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ isLoading: false });
      toast.success('Image processed successfully');
      return { success: true, data: res.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  fetchWeeklyReport: async (weekNumber) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosClient.get(`/reports/weekly/${weekNumber}`);
      set({ weeklyReport: res.data.data, isLoading: false });
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch weekly report';
      set({ error: message, isLoading: false });
      toast.error(message);
      return null;
    }
  },

  fetchMonthlyReport: async (month, year) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosClient.get(`/reports/monthly/${month}/${year}`);
      set({ monthlyReport: res.data.data, isLoading: false });
      return res.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch monthly report';
      set({ error: message, isLoading: false });
      toast.error(message);
      return null;
    }
  },

  fetchAllLogs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams(filters).toString();
      const res    = await axiosClient.get(`/logs/admin/all${params ? `?${params}` : ''}`);
      set({ logs: res.data.data, isLoading: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch logs';
      set({ error: message, isLoading: false });
    }
  },

  reviewLog: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res     = await axiosClient.patch(`/logs/admin/${id}/review`, data);
      const updated = res.data.data;
      set((state) => ({
        logs:      state.logs.map((l) => (l._id === id ? updated : l)),
        isLoading: false,
      }));
      toast.success('Log reviewed successfully');
      return { success: true, log: updated };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to review log';
      set({ error: message, isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },
}));