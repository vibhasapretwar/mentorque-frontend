import api from './axios';
export const getAllUsers = () => api.get('/api/admin/users');
export const getAllMentors = () => api.get('/api/admin/mentors');
export const updateMentorProfile = (id, data) => api.put(`/api/admin/mentors/${id}/profile`, data);
export const getRecommendations = (userId, callType) =>
  api.get('/api/admin/recommendations', { params: { userId, callType } });
export const createBooking = (data) => api.post('/api/admin/bookings', data);
export const getAllBookings = () => api.get('/api/admin/bookings');
export const updateBookingStatus = (id, status) => api.patch(`/api/admin/bookings/${id}/status`, { status });
