import { useState, useEffect } from 'react';
import { getAllUsers, getAllMentors, getAllBookings } from '../../api/admin';
import Layout from '../../components/common/Layout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import { Users, User, BookOpen, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, mentors: 0, bookings: 0, upcoming: 0 });

  useEffect(() => {
    Promise.all([getAllUsers(), getAllMentors(), getAllBookings()]).then(([u, m, b]) => {
      const upcoming = b.data.filter(x => x.status === 'scheduled' && new Date(x.scheduled_at) > new Date()).length;
      setStats({ users: u.data.length, mentors: m.data.length, bookings: b.data.length, upcoming });
    });
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
    { label: 'Mentors', value: stats.mentors, icon: User, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: 'All Bookings', value: stats.bookings, icon: BookOpen, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
    { label: 'Upcoming Calls', value: stats.upcoming, icon: Calendar, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  ];

  return (
    <Layout>
      <PageHeader title="Admin Dashboard" subtitle="Overview of the Mentorque platform" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, border }) => (
          <Card key={label} className={`border ${border}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${color}`}><Icon size={20}/></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">Quick Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Review Users', desc: 'Check user profiles, tags, and descriptions from the Users page.' },
            { step: '2', title: 'Get Recommendations', desc: 'On the Users page, pick a user and call type to see AI-matched mentors.' },
            { step: '3', title: 'Book a Call', desc: 'Check availability overlap and book the right mentor via the Bookings page.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{step}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}
