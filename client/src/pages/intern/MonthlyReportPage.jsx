import { useState, useRef } from 'react';
import { useLogStore } from '../../store/useLogStore';

export default function MonthlyReportPage() {
  const { fetchMonthlyReport, monthlyReport, isLoading } = useLogStore();
  const [month, setMonth] = useState('');
  const [year,  setYear]  = useState(new Date().getFullYear());
  const reportRef = useRef(null);

  const MONTHS = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];

  const handleFetch = async (e) => {
    e.preventDefault();
    await fetchMonthlyReport(month, year);
  };

  const handleDownload = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf()
      .set({
        margin:      0.5,
        filename:    `SIWES-${MONTHS[month - 1]}-${year}-Report.pdf`,
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF:       { unit: 'in', format: 'a4', orientation: 'portrait' },
      })
      .from(reportRef.current)
      .save();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-3xl mx-auto">        <h1 className="text-xl font-bold text-gray-900 mb-6">Monthly Report</h1>
        <form onSubmit={handleFetch} className="flex gap-3 mb-6">
          <select value={month} onChange={(e) => setMonth(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" disabled={isLoading || !month}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
            {isLoading ? 'Loading...' : 'Generate'}
          </button>
        </form>

        {monthlyReport && (
          <>
            <button onClick={handleDownload}
              className="mb-4 py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              Download PDF
            </button>

            <div ref={reportRef} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="text-center border-b border-gray-100 pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  SIWES Monthly Report — {MONTHS[monthlyReport.month - 1]} {monthlyReport.year}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {monthlyReport.intern.fullName} · {monthlyReport.intern.department}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-700">{monthlyReport.summary.totalDays}</p>
                  <p className="text-xs text-blue-500">Days</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-700">{monthlyReport.summary.totalHours}</p>
                  <p className="text-xs text-green-500">Hours</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xl font-bold text-purple-700">{monthlyReport.summary.totalWeeks}</p>
                  <p className="text-xs text-purple-500">Weeks</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xl font-bold text-yellow-700">{monthlyReport.summary.reviewedCount}</p>
                  <p className="text-xs text-yellow-500">Reviewed</p>
                </div>
              </div>

              {Object.entries(monthlyReport.byWeek).map(([week, logs]) => (
                <div key={week} className="mb-5">
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                    Week {week}
                  </h3>
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div key={log._id} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium text-gray-800">
                            {log.dayOfWeek} — {new Date(log.date).toDateString()}
                          </p>
                          <span className="text-xs text-gray-400">{log.hoursWorked}h</span>
                        </div>
                        <p className="text-sm text-gray-600">{log.tasksCompleted}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}