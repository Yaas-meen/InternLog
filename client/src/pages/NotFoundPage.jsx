import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function NotFoundPage() {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          to={user?.role === 'admin' ? '/admin' : user ? '/dashboard' : '/login'}
          className="py-2 px-5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          Go home
        </Link>
      </div>
    </div>
  );
}