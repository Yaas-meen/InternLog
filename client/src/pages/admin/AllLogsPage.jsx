import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLogStore } from '../../store/useLogStore';

export default function AllLogsPage() {
  const { logs, fetchAllLogs, isLoading } = useLogStore();
  const [searchParams] = useSearchParams();
  const internId = searchParams.get('internId');

  useEffect(() => {
    fetchAllLogs(internId ? { internId } : {});
  }, [internId]);

  return (
      <div className="p-6 max-w-3xl mx-auto">      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {internId ? 'Intern Logs' : 'All Log Entries'}
        </h1>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-400">No logs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log._id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-800 text-sm">
                      {log.intern?.firstName} {log.intern?.lastName}
                    </p>
                    <span className="text-xs text-gray-400">·</span>
                    <p className="text-xs text-gray-400">{log.intern?.department}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                      ${log.status === 'reviewed'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'}`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    {log.dayOfWeek} · Week {log.weekNumber} · {new Date(log.date).toDateString()} · {log.hoursWorked}h
                  </p>
                  <p className="text-sm text-gray-600 truncate">{log.tasksCompleted}</p>
                </div>
                <Link to={`/admin/logs/${log._id}`}
                  className="text-xs text-blue-600 hover:underline flex-shrink-0">
                  Review
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}