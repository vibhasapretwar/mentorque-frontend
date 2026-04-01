import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/user/UserDashboard';
import UserAvailability from './pages/user/UserAvailability';
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorAvailability from './pages/mentor/MentorAvailability';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMentors from './pages/admin/AdminMentors';
import AdminBookings from './pages/admin/AdminBookings';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />

          {/* User routes */}
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>
          } />
          <Route path="/user/availability" element={
            <ProtectedRoute allowedRoles={['user']}><UserAvailability /></ProtectedRoute>
          } />

          {/* Mentor routes */}
          <Route path="/mentor" element={
            <ProtectedRoute allowedRoles={['mentor']}><MentorDashboard /></ProtectedRoute>
          } />
          <Route path="/mentor/availability" element={
            <ProtectedRoute allowedRoles={['mentor']}><MentorAvailability /></ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>
          } />
          <Route path="/admin/mentors" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminMentors /></ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute allowedRoles={['admin']}><AdminBookings /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
