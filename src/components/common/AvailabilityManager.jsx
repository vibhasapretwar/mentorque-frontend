import { useState, useEffect } from 'react';
import { getMyAvailability, addAvailability, deleteAvailability } from '../../api/availability';
import { Plus, Trash2, Clock } from 'lucide-react';
import Card from './Card';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function AvailabilityManager() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ day_of_week: 1, start_time: '09:00', end_time: '17:00', is_recurring: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyAvailability()
      .then(r => setSlots(r.data))
      .catch(() => setError('Failed to load availability'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (form.start_time >= form.end_time) {
      setError('End time must be after start time'); return;
    }
    setSaving(true); setError('');
    try {
      const { data } = await addAvailability(form);
      setSlots(prev => [...prev, data]);
      setForm({ day_of_week: 1, start_time: '09:00', end_time: '17:00', is_recurring: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add slot');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAvailability(id);
      setSlots(prev => prev.filter(s => s.id !== id));
    } catch { setError('Failed to delete slot'); }
  };

  const grouped = DAYS.reduce((acc, _, i) => {
    acc[i] = slots.filter(s => s.day_of_week === i);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus size={16} /> Add Availability Slot
        </h3>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Day</label>
            <select
              value={form.day_of_week}
              onChange={e => setForm(f => ({ ...f, day_of_week: parseInt(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Start Time</label>
            <input
              type="time" value={form.start_time}
              onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">End Time</label>
            <input
              type="time" value={form.end_time}
              onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit" disabled={saving}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {saving ? 'Adding…' : 'Add Slot'}
            </button>
          </div>
        </form>
      </Card>

      <div className="grid gap-3">
        {DAYS.map((day, i) => (
          grouped[i].length > 0 && (
            <Card key={i} className="p-4">
              <h4 className="font-medium text-gray-800 mb-3">{day}</h4>
              <div className="space-y-2">
                {grouped[i].map(slot => (
                  <div key={slot.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock size={14} className="text-brand-500" />
                      <span>{slot.start_time.slice(0,5)} – {slot.end_time.slice(0,5)}</span>
                      {slot.is_recurring && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Recurring</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )
        ))}
        {slots.length === 0 && !loading && (
          <p className="text-center text-gray-400 py-12">No availability set yet. Add your first slot above.</p>
        )}
      </div>
    </div>
  );
}
