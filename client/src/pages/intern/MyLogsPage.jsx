import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLogStore } from '../../store/useLogStore';

export default function MyLogsPage() {
  const { logs, fetchMyLogs, deleteLog, isLoading } = useLogStore();

  useEffect(() => { fetchMyLogs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this log entry?')) return;
    await deleteLog(id);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold" style={{ color: '#1E293B' }}>
          My Log Entries
        </h1>
        <Link to="/logs/create"
          className="py-2 px-4 rounded-lg text-sm font-semibold text-white transition hover:-translate-y-0.5"
          style={{ background: '#71A5DE' }}>
          + New Log
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-sm" style={{ color: '#64748B' }}>
          Loading...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border"
          style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm mb-3" style={{ color: '#64748B' }}>No log entries yet</p>
          <Link to="/logs/create" className="text-sm font-medium hover:underline"
            style={{ color: '#71A5DE' }}>
            Create your first log
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log._id}
              className="bg-white rounded-xl border p-4 flex items-start justify-between gap-4"
              style={{ borderColor: '#E2E8F0' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm" style={{ color: '#1E293B' }}>
                    {log.dayOfWeek}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                    style={{
                      background: log.status === 'reviewed' ? '#EBF4FF' : '#FEF3C7',
                      color:      log.status === 'reviewed' ? '#71A5DE' : '#92400E',
                    }}>
                    {log.status}
                  </span>
                </div>
                <p className="text-xs mb-2" style={{ color: '#64748B' }}>
                  Week {log.weekNumber} · {new Date(log.date).toDateString()} · {log.hoursWorked}h
                </p>
                <p className="text-sm truncate" style={{ color: '#64748B' }}>
                  {log.tasksCompleted}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link to={`/logs/${log._id}`}
                  className="text-xs font-medium hover:underline"
                  style={{ color: '#71A5DE' }}>
                  View
                </Link>
                {log.status === 'pending' && (
                  <button onClick={() => handleDelete(log._id)}
                    className="text-xs font-medium hover:underline"
                    style={{ color: '#EF4444' }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}