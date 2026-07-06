import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t py-10" style={{ background: '#F8F9FB', borderColor: '#1E293B' }}>
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="font-serif text-lg font-bold"
          style={{ color: '#1E293B' }}>
          Intern<span style={{ color: '#71A5DE' }}>Log</span>
        </Link>

        <p className="text-xs" style={{ color: '#64748B' }}>
          Built for Nigerian SIWES students · {new Date().getFullYear()}
        </p>

        <div className="flex gap-5 text-xs font-medium" style={{ color: '#64748B' }}>
          <Link to="/login"    className="hover:underline">Sign in</Link>
          <Link to="/register" className="hover:underline">Register</Link>
          <a href="#features"  className="hover:underline">Features</a>
        </div>
      </div>
    </footer>
  );
}