import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b"
      style={{ borderColor: '#E2E8F0' }}>
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-serif text-xl font-bold"
          style={{ color: '#1E293B' }}>
          Intern<span style={{ color: '#71A5DE' }}>Log</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium"
          style={{ color: '#1E293B' }}>
          <a href="#features"     className="hover:opacity-70 transition">Features</a>
          <a href="#how-it-works" className="hover:opacity-70 transition">How it works</a>
          <a href="#pricing"      className="hover:opacity-70 transition">Pricing</a>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"
            className="text-sm font-semibold px-4 py-2 rounded-lg transition"
            style={{ color: '#1E293B' }}>
            Sign in
          </Link>
          <Link to="/register"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition"
            style={{ background: '#71A5DE' }}>
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 border-t"
          style={{ borderColor: '#E2E8F0', background: '#fff' }}>
          <div className="flex flex-col gap-4 pt-4 text-sm font-medium">
            <a href="#features"     onClick={() => setOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setOpen(false)}>How it works</a>
            <a href="#pricing"      onClick={() => setOpen(false)}>Pricing</a>
            <hr style={{ borderColor: '#E2E8F0' }} />
            <Link to="/login"    onClick={() => setOpen(false)}>Sign in</Link>
            <Link to="/register" onClick={() => setOpen(false)}
              className="text-white text-center py-2.5 rounded-lg font-semibold"
              style={{ background: '#71A5DE' }}>
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}