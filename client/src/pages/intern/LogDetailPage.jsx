import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLogStore } from '../../store/useLogStore';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

export default function LogDetailPage() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { fetchLog, updateLog, uploadImage, deleteLog, currentLog, isLoading } = useLogStore();

  const [editing,  setEditing]  = useState(false);
  const [form,     setForm]     = useState(null);
  const [imageFile,setImageFile]= useState(null);
  const [uploading,setUploading]= useState(false);

  useEffect(() => { fetchLog(id); }, [id]);

  useEffect(() => {
    if (currentLog) {
      setForm({
        tasksCompleted: currentLog.tasksCompleted,
        hoursWorked:    currentLog.hoursWorked,
        weekNumber:     currentLog.weekNumber,
        dayOfWeek:      currentLog.dayOfWeek,
      });
    }
  }, [currentLog]);

  const handleSave = async () => {
    const result = await updateLog(id, form);
    if (result.success) setEditing(false);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploading(true);
    await uploadImage(imageFile, id);
    await fetchLog(id);
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this log?')) return;
    const result = await deleteLog(id);
    if (result.success) navigate('/logs');
  };

  if (isLoading || !currentLog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  const isPending = currentLog.status === 'pending';

  return (
    <div className="p-6 max-w-3xl mx-auto">      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/logs')}
            className="text-sm text-gray-500 hover:text-gray-700">
            ← Back
          </button>
          {isPending && !editing && (
            <div className="flex gap-2">
              <button onClick={() => setEditing(true)}
                className="py-1.5 px-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Edit
              </button>
              <button onClick={handleDelete}
                className="py-1.5 px-3 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-lg font-bold text-gray-900">{currentLog.dayOfWeek}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
              ${currentLog.status === 'reviewed'
                ? 'bg-green-50 text-green-700'
                : 'bg-yellow-50 text-yellow-700'}`}>
              {currentLog.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Week {currentLog.weekNumber} · {new Date(currentLog.date).toDateString()}
          </p>

          {editing && form ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Day</label>
                  <select value={form.dayOfWeek}
                    onChange={(e) => setForm((p) => ({ ...p, dayOfWeek: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm bg-white">
                    {DAYS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Hours Worked</label>
                  <input type="number" min={1} max={12}
                    value={form.hoursWorked}
                    onChange={(e) => setForm((p) => ({ ...p, hoursWorked: Number(e.target.value) }))}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Tasks Completed</label>
                <textarea rows={5} value={form.tasksCompleted}
                  onChange={(e) => setForm((p) => ({ ...p, tasksCompleted: e.target.value }))}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave}
                  className="py-1.5 px-4 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                  Save
                </button>
                <button onClick={() => setEditing(false)}
                  className="py-1.5 px-4 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {currentLog.tasksCompleted}
              </p>
              <div className="text-xs text-gray-400">
                {currentLog.hoursWorked} hours worked
              </div>
            </>
          )}

          {currentLog.supervisorRemarks && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-xs font-medium text-purple-700 mb-1">Supervisor Remarks</p>
              <p className="text-sm text-purple-600">{currentLog.supervisorRemarks}</p>
            </div>
          )}
        </div>

        {/* Image section */}
        {isPending && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
            <h2 className="font-semibold text-gray-800 text-sm mb-3">Logbook Image</h2>
            {currentLog.imageUrl && (
              <img
                src={`${import.meta.env.VITE_UPLOADS_URL}/${currentLog.imageUrl.split('/').pop()}`}
                alt="Logbook page"
                className="w-full rounded-lg mb-3 border border-gray-100"
              />
            )}
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2
                  file:rounded file:border-0 file:text-xs
                  file:bg-blue-50 file:text-blue-700" />
              <button onClick={handleImageUpload}
                disabled={!imageFile || uploading}
                className="py-1 px-3 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 transition">
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {currentLog.extractedText && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 mb-1">OCR Extracted Text</p>
                <p className="text-xs text-gray-600 whitespace-pre-line">{currentLog.extractedText}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}