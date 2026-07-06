import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, PlusCircle,
  FileText, BarChart2, Settings, LogOut,
  Menu, X, Users,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const internLinks = [
  { to: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/logs',             icon: BookOpen,        label: 'My Logs'         },
  { to: '/logs/create',      icon: PlusCircle,      label: 'New Log'         },
  { to: '/reports/weekly',   icon: FileText,        label: 'Weekly Report'   },
  { to: '/reports/monthly',  icon: BarChart2,       label: 'Monthly Report'  },
  { to: '/settings',         icon: Settings,        label: 'Profile Settings'},
];

const adminLinks = [
  { to: '/admin',       icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/logs',  icon: Users,           label: 'All Logs'   },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);

  const links = user?.role === 'admin' ? adminLinks : internLinks;

  // Close sidebar on route change (mobile)
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: '#E2E8F0' }}>
        <Link to="/" className="font-serif text-xl font-bold"
          style={{ color: '#1E293B' }}>
          Intern<span style={{ color: '#71A5DE' }}>Log</span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: '#71A5DE' }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#1E293B' }}>
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs truncate capitalize"
              style={{ color: '#64748B' }}>
              {user?.role} · {user?.department}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {links.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <li key={to}>
                <Link to={to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition"
                  style={{
                    background: active ? '#71A5DE' : 'transparent',
                    color:      active ? '#FFFFFF'   : '#64748B',
                  }}>
                  <Icon size={17} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t pt-3" style={{ borderColor: '#E2E8F0' }}>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition hover:bg-red-50"
          style={{ color: '#64748B' }}>
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b"
        style={{ borderColor: '#E2E8F0' }}>
        <Link to="/" className="font-serif text-lg font-bold"
          style={{ color: '#1E293B' }}>
          Intern<span style={{ color: '#71A5DE' }}>Log</span>
        </Link>
        <button onClick={() => setOpen(true)}
          className="p-2 rounded-lg" style={{ color: '#1E293B' }}>
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)} />

          {/* Drawer — snaps from left */}
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col
            animate-[slideInLeft_0.25s_ease-out]">
            <button onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg"
              style={{ color: '#64748B' }}>
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r bg-white h-screen sticky top-0 flex-shrink-0"
        style={{ borderColor: '#E2E8F0' }}>
        <SidebarContent />
      </aside>
    </>
  );
}