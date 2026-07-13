import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogStore } from '../../store/useLogStore';
import { Camera, Sparkles } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date - start) / 86400000 + start.getDay() + 1) / 7);
}

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
  const [imagePreview,  setImagePreview]  = useState(null);
  const [uploading,     setUploading]     = useState(false);
  const [ocrDone,       setOcrDone]       = useState(false);
  const [ocrError,      setOcrError]      = useState('');

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
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setOcrDone(false);
    setOcrError('');
  };

  const handleOCR = async () => {
    if (!imageFile) return;
    setUploading(true);
    setOcrError('');
    const result = await uploadImage(imageFile);
    if (result.success && result.data.extractedText) {
      setForm((prev) => ({
        ...prev,
        tasksCompleted: result.data.extractedText,
      }));
      setOcrDone(true);
    } else {
      setOcrError(result.data?.error || 'Could not extract text. Please type manually.');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createLog(form);
    if (result.success) navigate(`/logs/${result.log._id}`);
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition";
  const inputStyle = { borderColor: '#D1E1F2', color: '#1E293B', background: '#fff' };
  const focusStyle = (e) => { e.target.style.borderColor = '#71A5DE'; e.target.style.boxShadow = '0 0 0 3px rgba(113,165,222,0.1)'; };
  const blurStyle  = (e) => { e.target.style.borderColor = '#D1E1F2'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold" style={{ color: '#1E293B' }}>
          New Log Entry
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>
          Record your activities for today
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm border"
          style={{ background: '#FEF2F2', color: '#DC2626', borderColor: '#FECACA' }}>
          {error}
        </div>
      )}

      {/* OCR Card */}
      <div className="bg-white rounded-xl border p-5 mb-5"
        style={{ borderColor: '#D1E1F2' }}>
        <div className="flex items-center gap-2 mb-1">
          <Camera size={16} style={{ color: '#71A5DE' }} />
          <h2 className="font-semibold text-sm" style={{ color: '#1E293B' }}>
            Scan Physical Logbook
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: '#EBF4FF', color: '#71A5DE' }}>
            Optional
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: '#64748B' }}>
          Take a photo of your handwritten logbook — AI will extract the text automatically
        </p>

        {/* Image preview */}
        {imagePreview && (
          <div className="mb-3 rounded-lg overflow-hidden border"
            style={{ borderColor: '#D1E1F2' }}>
            <img src={imagePreview} alt="Logbook preview"
              className="w-full max-h-48 object-cover" />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {/* File input — opens camera on mobile */}
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm font-medium transition hover:border-blue-300"
            style={{ borderColor: '#D1E1F2', color: '#64748B' }}>
            <Camera size={15} />
            {imageFile ? imageFile.name.slice(0, 20) + '...' : 'Choose or take photo'}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleOCR}
            disabled={!imageFile || uploading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #71A5DE, #8AB5E3)' }}>
            <Sparkles size={14} />
            {uploading ? 'Extracting...' : 'Extract Text'}
          </button>
        </div>

        {ocrDone && (
          <p className="text-xs mt-2 font-medium" style={{ color: '#16A34A' }}>
            ✅ Text extracted — review it below before saving
          </p>
        )}
        {ocrError && (
          <p className="text-xs mt-2" style={{ color: '#DC2626' }}>
            ⚠️ {ocrError}
          </p>
        )}
      </div>

      {/* Log form */}
      <form onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-5 space-y-4"
        style={{ borderColor: '#D1E1F2' }}>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: '#1E293B' }}>Date</label>
            <input type="date" name="date" value={form.date}
              onChange={handleChange} required
              className={inputClass} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: '#1E293B' }}>Week Number</label>
            <input type="number" name="weekNumber" value={form.weekNumber}
              onChange={handleChange} min={1} max={52} required
              className={inputClass} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: '#1E293B' }}>Day of Week</label>
            <select name="dayOfWeek" value={form.dayOfWeek}
              onChange={handleChange}
              className={inputClass} style={{ ...inputStyle, background: '#fff' }}
              onFocus={focusStyle} onBlur={blurStyle}>
              {DAYS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: '#1E293B' }}>Hours Worked</label>
            <input type="number" name="hoursWorked" value={form.hoursWorked}
              onChange={handleChange} min={1} max={12} required
              className={inputClass} style={inputStyle}
              onFocus={focusStyle} onBlur={blurStyle} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5"
            style={{ color: '#1E293B' }}>
            Tasks Completed
            <span className="ml-1 font-normal" style={{ color: '#64748B' }}>
              (min 10 characters)
            </span>
          </label>
          <textarea name="tasksCompleted" value={form.tasksCompleted}
            onChange={handleChange} required rows={6}
            placeholder="Describe what you worked on today..."
            className={`${inputClass} resize-none`} style={inputStyle}
            onFocus={focusStyle} onBlur={blurStyle} />
          <p className="text-xs mt-1" style={{ color: '#64748B' }}>
            {form.tasksCompleted.length} characters
          </p>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={isLoading}
            className="flex-1 py-3 rounded-lg text-sm font-semibold text-white transition disabled:opacity-50 hover:-translate-y-0.5"
            style={{ background: isLoading ? '#A8C8EC' : 'linear-gradient(135deg, #71A5DE, #8AB5E3)' }}>
            {isLoading ? 'Saving...' : 'Save Log Entry'}
          </button>
          <button type="button" onClick={() => navigate('/logs')}
            className="px-5 py-3 rounded-lg text-sm font-medium border transition hover:bg-gray-50"
            style={{ borderColor: '#D1E1F2', color: '#64748B' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}