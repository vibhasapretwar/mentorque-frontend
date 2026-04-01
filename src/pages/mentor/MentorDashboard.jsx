import { useState, useEffect } from 'react';
import { getMentorProfile, getMentorBookings } from '../../api/mentor';
import Layout from '../../components/common/Layout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { BookOpen, Calendar, User, Star } from 'lucide-react';
import { format } from 'date-fns';

export default function MentorDashboard() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getMentorProfile().then(r => setProfile(r.data));
    getMentorBookings().then(r => setBookings(r.data));
  }, []);

  const upcoming = bookings.filter(b => b.status === 'scheduled' && new Date(b.scheduled_at) > new Date());
  const past = bookings.filter(b => b.status !== 'scheduled' || new Date(b.scheduled_at) <= new Date());

  return (
    <Layout>
      <PageHeader title={`Hello, ${profile?.name} 👋`} subtitle="Your mentoring overview" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Calls', value: bookings.length, icon: BookOpen, color: 'text-blue-500' },
          { label: 'Upcoming', value: upcoming.length, icon: Calendar, color: 'text-green-500' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, icon: Star, color: 'text-amber-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-gray-50 rounded-lg ${color}`}><Icon size={18}/></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile */}
        <Card className="lg:col-span-1">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><User size={16}/>My Profile</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {profile?.tags?.map(t => <Badge key={t} label={t}/>)}
              </div>
            </div>
            {profile?.company_type && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Company Type</p>
                <Badge label={profile.company_type}/>
              </div>
            )}
            {profile?.domain && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Domain</p>
                <p className="text-sm text-gray-700 capitalize">{profile.domain.replace(/_/g,' ')}</p>
              </div>
            )}
            {profile?.location && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Location</p>
                <p className="text-sm text-gray-700">{profile.location}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">About</p>
              <p className="text-sm text-gray-700">{profile?.description || 'No description.'}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 italic">Profile is managed by Admin</p>
        </Card>

        {/* Upcoming calls */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={16}/> Upcoming Calls
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No upcoming calls scheduled.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(b => (
                  <div key={b.id} className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge label={b.call_type}/>
                      <Badge label={b.status}/>
                    </div>
                    <p className="text-sm font-medium text-gray-900">with {b.user_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(b.scheduled_at), 'EEEE, MMM d yyyy • h:mm a')} · {b.duration_minutes} min
                    </p>
                    {b.user_tags?.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {b.user_tags.map(t => <Badge key={t} label={t}/>)}
                      </div>
                    )}
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
