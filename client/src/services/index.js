import api from './api';

export const productService = {
  analyze: (formData) => api.post('/products/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  delete: (id) => api.delete(`/products/${id}`),
};

export const proposalService = {
  create: (data) => api.post('/proposals', data),
  getAll: (params) => api.get('/proposals', { params }),
  getOne: (id) => api.get(`/proposals/${id}`),
  delete: (id) => api.delete(`/proposals/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  generateReport: () => api.post('/dashboard/impact-report'),
  adminGetStats: () => api.get('/dashboard/admin/stats'),
  adminGetUsers: (params) => api.get('/dashboard/admin/users', { params }),
  adminToggleUser: (id) => api.put(`/dashboard/admin/users/${id}/toggle`),
  adminGetContacts: () => api.get('/dashboard/admin/contacts'),
};

export const supportService = {
  sendContact: (data) => api.post('/support/contact', data),
  sendChat: (data) => api.post('/support/chat', data),
  getChatHistory: (sessionId) => api.get(`/support/chat/${sessionId}`),
};
