import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function RegisterPage() {
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName:  '',
    lastName:   '',
    email:      '',
    password:   '',
    department: '',
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register({ ...form, role: 'intern' });
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: '#F8F9FB' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="font-serif text-2xl font-bold"
              style={{ color: '#1E293B' }}>
              Intern<span style={{ color: '#71A5DE' }}>Log</span>
            </span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: '#64748B' }}>
            Create your intern account
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1"
                  style={{ color: '#1E293B' }}>First name</label>
                <input type="text" name="firstName" value={form.firstName}
                  onChange={handleChange} required placeholder="Ada"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition"
                  style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
                  onFocus={e => e.target.style.borderColor = '#71A5DE'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1"
                  style={{ color: '#1E293B' }}>Last name</label>
                <input type="text" name="lastName" value={form.lastName}
                  onChange={handleChange} required placeholder="Okafor"
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition"
                  style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
                  onFocus={e => e.target.style.borderColor = '#71A5DE'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            </div>

            {[
              { label: 'Email address', name: 'email',      type: 'email',    placeholder: 'you@example.com' },
              { label: 'Password',      name: 'password',   type: 'password', placeholder: 'At least 8 characters' },
              { label: 'Department',    name: 'department', type: 'text',     placeholder: 'e.g. Software Engineering' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-medium mb-1"
                  style={{ color: '#1E293B' }}>{label}</label>
                <input type={type} name={name} value={form[name]}
                  onChange={handleChange}
                  required={name !== 'department'}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition"
                  style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
                  onFocus={e => e.target.style.borderColor = '#71A5DE'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            ))}

            <button type="submit" disabled={isLoading}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition"
              style={{ background: isLoading ? '#5A8DC9' : '#71A5DE' }}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold underline"
              style={{ color: '#71A5DE' }}>Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#64748B' }}>
          Admin? Contact your institution for access.
        </p>
      </div>
    </div>
  );
}