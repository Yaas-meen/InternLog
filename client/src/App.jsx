import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

import ErrorBoundary  from './components/shared/ErrorBoundary';
import AppLayout      from './components/shared/AppLayout';
import NotFoundPage   from './pages/NotFoundPage';

import InternGuard from './components/guards/InternGuard';
import AdminGuard  from './components/guards/AdminGuard';
import PublicGuard from './components/guards/PublicGuard';

import LandingPage     from './pages/LandingPage';
import LoginPage       from './pages/auth/LoginPage';
import RegisterPage    from './pages/auth/RegisterPage';

import InternDashboard   from './pages/intern/InternDashboard';
import CreateLogPage     from './pages/intern/CreateLogPage';
import MyLogsPage        from './pages/intern/MyLogsPage';
import LogDetailPage     from './pages/intern/LogDetailPage';
import WeeklyReportPage  from './pages/intern/WeeklyReportPage';
import MonthlyReportPage from './pages/intern/MonthlyReportPage';
import ProfileSettings   from './pages/intern/ProfileSettings';

import AdminDashboard from './pages/admin/AdminDashboard';
import AllLogsPage    from './pages/admin/AllLogsPage';
import ReviewLogPage  from './pages/admin/ReviewLogPage';

const InternPage = ({ children }) => (
  <InternGuard>
    <AppLayout>{children}</AppLayout>
  </InternGuard>
);

const AdminPage = ({ children }) => (
  <AdminGuard>
    <AppLayout>{children}</AppLayout>
  </AdminGuard>
);

export default function App() {
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    refreshUser().finally(() => setBooting(false));
  }, []);

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#F8F9FB' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
            style={{ borderColor: '#71A5DE', borderTopColor: 'transparent' }} />
          <p className="text-sm font-serif" style={{ color: '#1E293B' }}>
            InternLog
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public / Landing */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<PublicGuard><LoginPage /></PublicGuard>} />
          <Route path="/register" element={<PublicGuard><RegisterPage /></PublicGuard>} />

          {/* Intern */}
          <Route path="/dashboard"       element={<InternPage><InternDashboard /></InternPage>} />
          <Route path="/logs/create"     element={<InternPage><CreateLogPage /></InternPage>} />
          <Route path="/logs"            element={<InternPage><MyLogsPage /></InternPage>} />
          <Route path="/logs/:id"        element={<InternPage><LogDetailPage /></InternPage>} />
          <Route path="/reports/weekly"  element={<InternPage><WeeklyReportPage /></InternPage>} />
          <Route path="/reports/monthly" element={<InternPage><MonthlyReportPage /></InternPage>} />
          <Route path="/settings"        element={<InternPage><ProfileSettings /></InternPage>} />

          {/* Admin */}
          <Route path="/admin"          element={<AdminPage><AdminDashboard /></AdminPage>} />
          <Route path="/admin/logs"     element={<AdminPage><AllLogsPage /></AdminPage>} />
          <Route path="/admin/logs/:id" element={<AdminPage><ReviewLogPage /></AdminPage>} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}