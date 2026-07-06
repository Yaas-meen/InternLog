import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginPage() {
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#F8F9FB' }}>
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl font-bold"
              style={{ color: '#1E293B' }}>
              Intern<span style={{ color: '#71A5DE' }}>Log</span>
            </span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: '#64748B' }}>
            Sign in to your account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8"
          style={{ borderColor: '#E2E8F0' }}>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm"
              style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Email address', name: 'email',    type: 'email',    placeholder: 'you@example.com' },
              { label: 'Password',      name: 'password', type: 'password', placeholder: '••••••••' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-medium mb-1"
                  style={{ color: '#1E293B' }}>{label}</label>
                <input type={type} name={name} value={form[name]}
                  onChange={handleChange} required placeholder={placeholder}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition"
                  style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
                  onFocus={e => e.target.style.borderColor = '#71A5DE'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            ))}

            <button type="submit" disabled={isLoading}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition"
              style={{ background: isLoading ? '#5A8DC9' : '#71A5DE' }}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: '#64748B' }}>
            New intern?{' '}
            <Link to="/register" className="font-semibold underline"
              style={{ color: '#71A5DE' }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}