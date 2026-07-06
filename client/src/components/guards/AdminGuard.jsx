import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminGuard({ children }) {
  const { user, accessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken || !user) {
      navigate('/login', { replace: true });
    } else if (user.role !== 'admin') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, accessToken, navigate]);

  if (!accessToken || !user || user.role !== 'admin') return null;
  return children;
}