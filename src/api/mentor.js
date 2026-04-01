import api from './axios';
export const getMentorProfile = () => api.get('/api/mentor/profile');
export const getMentorBookings = () => api.get('/api/mentor/bookings');
