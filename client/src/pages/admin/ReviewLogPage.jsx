import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLogStore } from '../../store/useLogStore';

export default function ReviewLogPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { fetchLog, reviewLog, currentLog, isLoading } = useLogStore();

  const [remarks, setRemarks] = useState('');
  const [status,  setStatus]  = useState('reviewed');
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { fetchLog(id); }, [id]);

  useEffect(() => {
    if (currentLog?.supervisorRemarks) {
      setRemarks(currentLog.supervisorRemarks);
    }
  }, [currentLog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await reviewLog(id, { supervisorRemarks: remarks, status });
    setSaving(false);
    if (result.success) navigate('/admin/logs');
  };

  if (isLoading || !currentLog) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
      <div className="p-6 max-w-3xl mx-auto">      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate('/admin/logs')}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 block">
          ← Back to logs
        </button>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-lg font-bold text-gray-900">
              {currentLog.intern?.firstName} {currentLog.intern?.lastName}
            </h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
              ${currentLog.status === 'reviewed'
                ? 'bg-green-50 text-green-700'
                : 'bg-yellow-50 text-yellow-700'}`}>
              {currentLog.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            {currentLog.dayOfWeek} · Week {currentLog.weekNumber} ·{' '}
            {new Date(currentLog.date).toDateString()} · {currentLog.hoursWorked}h
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {currentLog.tasksCompleted}
          </p>

          {currentLog.imageUrl && (
            <div className="mt-4">
              <img
                src={`${import.meta.env.VITE_UPLOADS_URL}/${currentLog.imageUrl.split('/').pop()}`}
                alt="Logbook"
                className="w-full rounded-lg border border-gray-100"
              />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Add Review</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="reviewed">Reviewed</option>
              <option value="pending">Keep Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supervisor Remarks
            </label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)}
              rows={4} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your feedback for this log entry..." />
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
            {saving ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}