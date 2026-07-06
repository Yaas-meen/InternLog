import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useLogStore }  from '../../store/useLogStore';
import { LayoutDashboard, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function InternDashboard() {
  const { user }                         = useAuthStore();
  const { logs, fetchMyLogs, isLoading } = useLogStore();

  useEffect(() => { fetchMyLogs(); }, []);

  const totalHours   = logs.reduce((s, l) => s + l.hoursWorked, 0);
  const reviewed     = logs.filter((l) => l.status === 'reviewed').length;
  const pending      = logs.filter((l) => l.status === 'pending').length;

  const stats = [
    { label: 'Total Logs',   value: logs.length, icon: LayoutDashboard, color: '#71A5DE', bg: '#EBF4FF' },
    { label: 'Hours Logged', value: totalHours,   icon: Clock,           color: '#71A5DE', bg: '#DBEAFE' },
    { label: 'Reviewed',     value: reviewed,     icon: CheckCircle,     color: '#71A5DE', bg: '#EBF4FF' },
    { label: 'Pending',      value: pending,      icon: AlertCircle,     color: '#F59E0B', bg: '#FEF3C7' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold" style={{ color: '#1E293B' }}>
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          {user?.department}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label}
            className="bg-white rounded-xl border p-4"
            style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: '#64748B' }}>{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: bg }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-bold font-serif" style={{ color: '#1E293B' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/logs/create"
          className="rounded-xl p-5 text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          style={{ background: '#71A5DE' }}>
          <p className="font-semibold mb-1">+ New Log Entry</p>
          <p className="text-xs opacity-75">Record today's activities</p>
        </Link>
        <Link to="/reports/weekly"
          className="rounded-xl border p-5 bg-white transition hover:-translate-y-0.5 hover:shadow-md hover:border-green-200"
          style={{ borderColor: '#E2E8F0' }}>
          <p className="font-semibold mb-1" style={{ color: '#1E293B' }}>Weekly Report</p>
          <p className="text-xs" style={{ color: '#64748B' }}>View and download</p>
        </Link>
        <Link to="/reports/monthly"
          className="rounded-xl border p-5 bg-white transition hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200"
          style={{ borderColor: '#E2E8F0' }}>
          <p className="font-semibold mb-1" style={{ color: '#1E293B' }}>Monthly Report</p>
          <p className="text-xs" style={{ color: '#64748B' }}>View and download</p>
        </Link>
      </div>

      {/* Recent logs */}
      <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: '#E2E8F0' }}>
          <h2 className="font-semibold text-sm" style={{ color: '#1E293B' }}>
            Recent Logs
          </h2>
          <Link to="/logs" className="text-xs font-medium hover:underline"
            style={{ color: '#71A5DE' }}>
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm" style={{ color: '#64748B' }}>
            Loading...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm mb-3" style={{ color: '#64748B' }}>No logs yet</p>
            <Link to="/logs/create" className="text-sm font-medium hover:underline"
              style={{ color: '#71A5DE' }}>
              Create your first log
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
            {logs.slice(0, 5).map((log) => (
              <Link key={log._id} to={`/logs/${log._id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1E293B' }}>
                    {log.dayOfWeek}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                    Week {log.weekNumber} · {new Date(log.date).toDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: '#64748B' }}>
                    {log.hoursWorked}h
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                    style={{
                      background: log.status === 'reviewed' ? '#EBF4FF' : '#FEF3C7',
                      color:      log.status === 'reviewed' ? '#71A5DE' : '#92400E',
                    }}>
                    {log.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}