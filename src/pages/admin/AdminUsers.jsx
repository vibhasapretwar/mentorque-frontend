import { useState, useEffect } from 'react';
import { getAllUsers, getRecommendations, createBooking } from '../../api/admin';
import { getOverlap } from '../../api/availability';
import Layout from '../../components/common/Layout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Star, Clock, ChevronRight, Calendar } from 'lucide-react';

const CALL_TYPES = [
  { value: 'resume_revamp', label: 'Resume Revamp' },
  { value: 'job_market_guidance', label: 'Job Market Guidance' },
  { value: 'mock_interview', label: 'Mock Interview' },
];

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [callType, setCallType] = useState('resume_revamp');
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRec, setLoadingRec] = useState(false);
  const [overlap, setOverlap] = useState([]);
  const [bookModal, setBookModal] = useState(false);
  const [bookingMentor, setBookingMentor] = useState(null);
  const [bookForm, setBookForm] = useState({ scheduled_at: '', duration_minutes: 60, notes: '' });
  const [booking, setBooking] = useState(false);
  const [bookSuccess, setBookSuccess] = useState('');

  useEffect(() => { getAllUsers().then(r => setUsers(r.data)); }, []);

  const fetchRecommendations = async () => {
    if (!selected) return;
    setLoadingRec(true);
    try {
      const { data } = await getRecommendations(selected.id, callType);
      setRecommendations(data.recommendations);
    } finally { setLoadingRec(false); }
  };

  const fetchOverlap = async (mentorId) => {
    if (!selected) return;
    const { data } = await getOverlap(selected.id, mentorId);
    setOverlap(data);
  };

  const openBookModal = (mentor) => {
    setBookingMentor(mentor);
    fetchOverlap(mentor.id);
    setBookModal(true);
    setBookSuccess('');
  };

  const handleBook = async () => {
    if (!bookForm.scheduled_at) return;
    setBooking(true);
    try {
      await createBooking({
        user_id: selected.id,
        mentor_id: bookingMentor.id,
        call_type: callType,
        scheduled_at: bookForm.scheduled_at,
        duration_minutes: bookForm.duration_minutes,
        notes: bookForm.notes,
      });
      setBookSuccess(`✅ Call booked successfully with ${bookingMentor.name}!`);
      setBookForm({ scheduled_at: '', duration_minutes: 60, notes: '' });
    } catch (err) {
      setBookSuccess('❌ ' + (err.response?.data?.error || 'Booking failed'));
    } finally { setBooking(false); }
  };

  return (
    <Layout>
      <PageHeader title="Users" subtitle="View user profiles and book mentoring calls" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User list */}
        <div className="lg:col-span-1 space-y-2">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => { setSelected(u); setRecommendations([]); }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selected?.id === u.id
                  ? 'bg-brand-50 border-brand-300 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-brand-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <ChevronRight size={14} className="text-gray-400"/>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {u.tags?.map(t => <Badge key={t} label={t}/>)}
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {!selected ? (
            <Card className="flex items-center justify-center h-64">
              <p className="text-gray-400">Select a user to view details and get recommendations</p>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <h3 className="font-semibold text-gray-900 mb-3">{selected.name}</h3>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selected.tags?.map(t => <Badge key={t} label={t}/>)}
                </div>
                <p className="text-sm text-gray-600">{selected.description || 'No description provided.'}</p>
              </Card>

              <Card>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star size={15}/> Get Mentor Recommendations
                </h3>
                <div className="flex gap-3 mb-4">
                  <select
                    value={callType}
                    onChange={e => setCallType(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {CALL_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <button
                    onClick={fetchRecommendations}
                    disabled={loadingRec}
                    className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loadingRec ? 'Matching…' : 'Find Mentors'}
                  </button>
                </div>

                {recommendations.map((mentor, i) => (
                  <div key={mentor.id} className="p-4 rounded-xl border border-gray-200 mb-3 last:mb-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{i + 1}. {mentor.name}</span>
                          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                            Score: {mentor.score}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {mentor.tags?.map(t => <Badge key={t} label={t}/>)}
                        </div>
                        <p className="text-xs text-gray-500">{mentor.reasoning}</p>
                      </div>
                      <button
                        onClick={() => openBookModal(mentor)}
                        className="ml-3 flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                      >
                        <Calendar size={13}/> Book
                      </button>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <Modal open={bookModal} onClose={() => setBookModal(false)} title={`Book Call with ${bookingMentor?.name}`}>
        {bookSuccess ? (
          <p className={`text-sm font-medium text-center py-4 ${bookSuccess.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {bookSuccess}
          </p>
        ) : null}

        {overlap.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-800 mb-2 flex items-center gap-1"><Clock size={12}/> Availability Overlap</p>
            <div className="space-y-1">
              {overlap.map((s, i) => (
                <p key={i} className="text-xs text-green-700">
                  {DAYS[s.day_of_week]}: {String(s.overlap_start).slice(0,5)} – {String(s.overlap_end).slice(0,5)}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Call Type</label>
            <input value={CALL_TYPES.find(c => c.value === callType)?.label} readOnly
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500"/>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Scheduled Date & Time *</label>
            <input type="datetime-local"
              value={bookForm.scheduled_at}
              onChange={e => setBookForm(f => ({ ...f, scheduled_at: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Duration (minutes)</label>
            <select
              value={bookForm.duration_minutes}
              onChange={e => setBookForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {[30, 45, 60, 90].map(d => <option key={d} value={d}>{d} min</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Notes (optional)</label>
            <textarea
              value={bookForm.notes}
              onChange={e => setBookForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Any notes for this session..."
            />
          </div>
          <button
            onClick={handleBook}
            disabled={booking || !bookForm.scheduled_at}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {booking ? 'Booking…' : 'Confirm Booking'}
          </button>
        </div>
      </Modal>
    </Layout>
  );
}
