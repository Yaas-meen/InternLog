import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to={isAdmin ? '/admin' : '/dashboard'}
          className="text-base font-bold text-blue-600">
          InternLog
        </Link>

        {!isAdmin && (
          <div className="hidden md:flex items-center gap-4 text-sm">
            <Link to="/dashboard"       className="text-gray-600 hover:text-blue-600">Dashboard</Link>
            <Link to="/logs"            className="text-gray-600 hover:text-blue-600">My Logs</Link>
            <Link to="/logs/create"     className="text-gray-600 hover:text-blue-600">New Log</Link>
            <Link to="/reports/weekly"  className="text-gray-600 hover:text-blue-600">Weekly Report</Link>
            <Link to="/reports/monthly" className="text-gray-600 hover:text-blue-600">Monthly Report</Link>
          </div>
        )}

        {isAdmin && (
          <div className="hidden md:flex items-center gap-4 text-sm">
            <Link to="/admin"       className="text-gray-600 hover:text-blue-600">Dashboard</Link>
            <Link to="/admin/logs"  className="text-gray-600 hover:text-blue-600">All Logs</Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 hidden md:block">
          {user?.fullName || `${user?.firstName} ${user?.lastName}`}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium
          bg-blue-50 text-blue-700 capitalize">
          {user?.role}
        </span>
        <button onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 transition">
          Logout
        </button>
      </div>
    </nav>
  );
}