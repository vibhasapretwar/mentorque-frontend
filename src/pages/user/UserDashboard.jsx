import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile, getUserBookings } from '../../api/user';
import Layout from '../../components/common/Layout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { Calendar, BookOpen, User } from 'lucide-react';
import { format } from 'date-fns';

const ALL_TAGS = ['tech','non_tech','good_communication','asks_a_lot_of_questions'];

const CALL_TYPE_LABELS = {
  resume_revamp: 'Resume Revamp',
  job_market_guidance: 'Job Market Guidance',
  mock_interview: 'Mock Interview',
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ tags: [], description: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUserProfile().then(r => {
      setProfile(r.data);
      setForm({ tags: r.data.tags || [], description: r.data.description || '' });
    });
    getUserBookings().then(r => setBookings(r.data));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updateUserProfile(form);
      setProfile(data);
      setEditMode(false);
    } finally { setSaving(false); }
  };

  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }));
  };

  return (
    <Layout>
      <PageHeader title={`Welcome, ${user?.name} 👋`} subtitle="Manage your profile and view your scheduled calls" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><User size={16}/>Profile</h3>
            <button
              onClick={() => editMode ? handleSave() : setEditMode(true)}
              disabled={saving}
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              {saving ? 'Saving…' : editMode ? 'Save' : 'Edit'}
            </button>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.tags.includes(tag)
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'
                      }`}
                    >
                      {tag.replace(/_/g,' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Tell us about your goals, background..."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile?.tags?.length ? profile.tags.map(t => <Badge key={t} label={t} />) : <span className="text-sm text-gray-400">No tags set</span>}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">About</p>
                <p className="text-sm text-gray-700">{profile?.description || 'No description yet.'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm text-gray-700">{profile?.email}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen size={16}/> Your Scheduled Calls
            </h3>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={36} className="text-gray-300 mx-auto mb-3"/>
                <p className="text-gray-400 text-sm">No calls scheduled yet.</p>
                <p className="text-gray-400 text-xs mt-1">Make sure your availability is set so the admin can book a call for you.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="flex items-start justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge label={b.call_type} />
                        <Badge label={b.status} />
                      </div>
                      <p className="text-sm font-medium text-gray-900">with {b.mentor_name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(b.scheduled_at), 'EEEE, MMM d yyyy • h:mm a')}
                        {' · '}{b.duration_minutes} min
                      </p>
                      {b.notes && <p className="text-xs text-gray-400 mt-1 italic">{b.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
