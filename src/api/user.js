import api from './axios';
export const getUserProfile = () => api.get('/api/user/profile');
export const updateUserProfile = (data) => api.put('/api/user/profile', data);
export const getUserBookings = () => api.get('/api/user/bookings');
