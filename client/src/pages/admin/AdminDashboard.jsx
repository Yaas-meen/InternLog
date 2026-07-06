import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, AlertCircle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export default function AdminDashboard() {
  const [data,      setData]      = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/reports/admin/dashboard')
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const totals = data.reduce(
    (acc, d) => ({
      logs:    acc.logs    + d.stats.totalLogs,
      hours:   acc.hours   + d.stats.totalHours,
      pending: acc.pending + d.stats.pendingLogs,
    }),
    { logs: 0, hours: 0, pending: 0 }
  );

  const stats = [
    { label: 'Total Interns',  value: data.length,    icon: Users,       color: '#71A5DE', bg: '#EBF4FF' },
    { label: 'Total Logs',     value: totals.logs,    icon: BookOpen,    color: '#71A5DE', bg: '#EBF4FF' },
    { label: 'Pending Review', value: totals.pending, icon: AlertCircle, color: '#F59E0B', bg: '#FEF3C7' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif" style={{ color: '#1E293B' }}>
          Admin Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          Overview of all intern activity
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label}
            className="bg-white rounded-xl border p-5"
            style={{ borderColor: '#D1E1F2' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: '#64748B' }}>
                {label}
              </p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: bg }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold font-serif" style={{ color: '#1E293B' }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Interns table */}
      <div className="bg-white rounded-xl border" style={{ borderColor: '#D1E1F2' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: '#EBF4FF' }}>
          <h2 className="font-semibold text-sm" style={{ color: '#1E293B' }}>
            Interns
          </h2>
          <Link to="/admin/logs"
            className="text-xs font-semibold hover:underline"
            style={{ color: '#71A5DE' }}>
            View all logs
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm" style={{ color: '#64748B' }}>
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-sm" style={{ color: '#64748B' }}>
            No interns registered yet.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#EBF4FF' }}>
            {data.map(({ intern, stats: s }) => (
              <div key={intern._id} className="px-5 py-4">

                {/* Row top: name + pending badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate"
                      style={{ color: '#1E293B' }}>
                      {intern.fullName}
                    </p>
                    <p className="text-xs truncate mt-0.5"
                      style={{ color: '#64748B' }}>
                      {intern.email}
                    </p>
                    {intern.department && (
                      <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                        {intern.department}
                      </p>
                    )}
                  </div>
                  {s.pendingLogs > 0 && (
                    <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: '#FEF3C7', color: '#92400E' }}>
                      {s.pendingLogs} pending
                    </span>
                  )}
                </div>

                {/* Row bottom: stats + link */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: '#EBF4FF', color: '#71A5DE' }}>
                      {s.totalLogs} logs
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: '#EBF4FF', color: '#71A5DE' }}>
                      {s.totalHours}h
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: '#D1FAE5', color: '#065F46' }}>
                      {s.reviewedLogs} reviewed
                    </span>
                  </div>
                  <Link
                    to={`/admin/logs?internId=${intern._id}`}
                    className="text-xs font-semibold hover:underline flex-shrink-0 ml-3"
                    style={{ color: '#71A5DE' }}>
                    View logs →
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}