import { useState, useRef } from 'react';
import { useLogStore } from '../../store/useLogStore';

export default function WeeklyReportPage() {
  const { fetchWeeklyReport, weeklyReport, isLoading } = useLogStore();
  const [weekNumber, setWeekNumber] = useState('');
  const reportRef = useRef(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    await fetchWeeklyReport(weekNumber);
  };

  const handleDownload = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf()
      .set({
        margin:      0.5,
        filename:    `SIWES-Week${weekNumber}-Report.pdf`,
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF:       { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(reportRef.current)
      .save();
  };

  return (
    <div className="p-6 max-w-3x1 mx-auto">
        <h1 className="font-serif text-2x1 font-bold mb-6">Weekly Report</h1>

        <form onSubmit={handleFetch} className="flex gap-3 mb-6" style={{ color: '#1E293B' }}>
          <input type="number" min={1} max={52} value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            placeholder="Enter week number"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" disabled={isLoading || !weekNumber}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
            {isLoading ? 'Loading...' : 'Generate'}
          </button>
        </form>

        {weeklyReport && (
          <>
            <button onClick={handleDownload}
              className="mb-4 py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              Download PDF
            </button>

            <div ref={reportRef} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="text-center border-b border-gray-100 pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  SIWES Weekly Report — Week {weeklyReport.weekNumber}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {weeklyReport.intern.fullName} · {weeklyReport.intern.department}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{weeklyReport.summary.totalDays}</p>
                  <p className="text-xs text-blue-500">Days Logged</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{weeklyReport.summary.totalHours}</p>
                  <p className="text-xs text-green-500">Hours Worked</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-700">{weeklyReport.summary.reviewedCount}</p>
                  <p className="text-xs text-purple-500">Reviewed</p>
                </div>
              </div>

              {weeklyReport.aiSummary && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm">AI Summary</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {weeklyReport.aiSummary}
                  </p>
                </div>
              )}

              <h3 className="font-semibold text-gray-700 mb-3 text-sm">Daily Entries</h3>
              <div className="space-y-3">
                {weeklyReport.logs.map((log) => (
                  <div key={log._id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-800 text-sm">
                        {log.dayOfWeek} — {new Date(log.date).toDateString()}
                      </p>
                      <span className="text-xs text-gray-400">{log.hoursWorked}h</span>
                    </div>
                    <p className="text-sm text-gray-600">{log.tasksCompleted}</p>
                    {log.supervisorRemarks && (
                      <p className="text-xs text-purple-600 mt-2 italic">
                        Remarks: {log.supervisorRemarks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
    </div>
  );
}