import api from './axios';
export const getMyAvailability = () => api.get('/api/availability');
export const addAvailability = (data) => api.post('/api/availability', data);
export const deleteAvailability = (id) => api.delete(`/api/availability/${id}`);
export const getUserAvailability = (userId) => api.get(`/api/availability/user/${userId}`);
export const getOverlap = (userId, mentorId) =>
  api.get('/api/availability/overlap', { params: { userId, mentorId } });
