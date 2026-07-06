import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function InternGuard({ children }) {
  const { user, accessToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken || !user) {
      navigate('/login', { replace: true });
    } else if (user.role !== 'intern') {
      navigate('/admin', { replace: true });
    }
  }, [user, accessToken, navigate]);

  if (!accessToken || !user || user.role !== 'intern') return null;
  return children;
}