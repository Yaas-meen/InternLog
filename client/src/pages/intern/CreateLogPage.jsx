import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogStore } from '../../store/useLogStore';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function CreateLogPage() {
  const { createLog, uploadImage, isLoading, error } = useLogStore();
  const navigate = useNavigate();

  const today = new Date();
  const [form, setForm] = useState({
    date:           today.toISOString().split('T')[0],
    weekNumber:     getWeekNumber(today),
    dayOfWeek:      DAYS[today.getDay() - 1] || 'Monday',
    tasksCompleted: '',
    hoursWorked:    8,
  });

  const [imageFile,     setImageFile]     = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [uploading,     setUploading]     = useState(false);
  const [ocrDone,       setOcrDone]       = useState(false);

  function getWeekNumber(date) {
    const start = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - start) / 86400000 + start.getDay() + 1) / 7);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'hoursWorked' || name === 'weekNumber'
        ? Number(value)
        : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  const handleOCR = async () => {
    if (!imageFile) return;
    setUploading(true);
    const result = await uploadImage(imageFile);
    if (result.success) {
      setExtractedText(result.data.extractedText || '');
      setForm((prev) => ({
        ...prev,
        tasksCompleted: result.data.extractedText || prev.tasksCompleted,
      }));
      setOcrDone(true);
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createLog(form);
    if (result.success) {
      navigate(`/logs/${result.log._id}`);
    }
  };

  return (
      <div className="p-6 max-w-3xl mx-auto">      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">New Log Entry</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* OCR section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-gray-800 mb-1">
             Upload Logbook Image (Optional)
          </h2>
          <p className="text-xs text-gray-400 mb-3">
            AI will extract text from your physical logbook page automatically
          </p>
          <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2
            file:rounded file:border-0 file:text-xs
            file:bg-green-50 file:text-green-700"
          />
            <button type="button" onClick={handleOCR}
              disabled={!imageFile || uploading}
              className="py-1.5 px-4 bg-blue-600 text-white rounded-lg text-sm
                font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              {uploading ? 'Processing...' : 'Extract Text'}
            </button>
          </div>
          {ocrDone && (
            <p className="text-xs text-green-600 mt-2">
               Text extracted — review and edit below
            </p>
          )}
        </div>

        {/* Log form */}
        <form onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" name="date" value={form.date}
                onChange={handleChange} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Week Number</label>
              <input type="number" name="weekNumber" value={form.weekNumber}
                onChange={handleChange} min={1} max={52} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
              <select name="dayOfWeek" value={form.dayOfWeek}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
              <input type="number" name="hoursWorked" value={form.hoursWorked}
                onChange={handleChange} min={1} max={12} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tasks Completed
            </label>
            <textarea name="tasksCompleted" value={form.tasksCompleted}
              onChange={handleChange} required rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe what you worked on today..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isLoading}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              {isLoading ? 'Saving...' : 'Save Log Entry'}
            </button>
            <button type="button" onClick={() => navigate('/logs')}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}