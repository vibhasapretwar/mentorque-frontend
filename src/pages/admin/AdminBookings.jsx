import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../../api/admin';
import Layout from '../../components/common/Layout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { format } from 'date-fns';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';

const CALL_TYPE_LABELS = {
  resume_revamp: 'Resume Revamp',
  job_market_guidance: 'Job Market Guidance',
  mock_interview: 'Mock Interview',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBookings().then(r => setBookings(r.data)).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      const { data } = await updateBookingStatus(id, status);
      setBookings(bs => bs.map(b => b.id === id ? { ...b, status: data.status } : b));
    } catch (e) { console.error(e); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <Layout>
      <PageHeader title="Bookings" subtitle="All scheduled mentoring calls" />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'scheduled', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-brand-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
            }`}
          >
            {f} {f !== 'all' ? `(${bookings.filter(b => b.status === f).length})` : `(${bookings.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-12">Loading bookings…</p>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-16">
          <Calendar size={40} className="text-gray-300 mx-auto mb-3"/>
          <p className="text-gray-400">No bookings found.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <Card key={b.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge label={b.call_type} />
                    <Badge label={b.status} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">User</p>
                      <p className="font-medium text-gray-900">{b.user_name}</p>
                      <p className="text-xs text-gray-500">{b.user_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Mentor</p>
                      <p className="font-medium text-gray-900">{b.mentor_name}</p>
                      <p className="text-xs text-gray-500">{b.mentor_email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12}/>
                      {format(new Date(b.scheduled_at), 'EEE, MMM d yyyy • h:mm a')}
                    </span>
                    <span>{b.duration_minutes} min</span>
                    {b.admin_name && <span>Booked by: {b.admin_name}</span>}
                  </div>
                  {b.notes && <p className="text-xs text-gray-400 mt-2 italic">"{b.notes}"</p>}
                </div>

                {b.status === 'scheduled' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleStatus(b.id, 'completed')}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark completed"
                    >
                      <CheckCircle size={18}/>
                    </button>
                    <button
                      onClick={() => handleStatus(b.id, 'cancelled')}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancel"
                    >
                      <XCircle size={18}/>
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
