import { useState, useEffect } from 'react';
import { getAllMentors, updateMentorProfile } from '../../api/admin';
import Layout from '../../components/common/Layout';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Edit3, MapPin, Briefcase } from 'lucide-react';

const ALL_TAGS = ['tech','non_tech','big_company','public_company','senior_developer','good_communication','india','ireland'];

export default function AdminMentors() {
  const [mentors, setMentors] = useState([]);
  const [editMentor, setEditMentor] = useState(null);
  const [form, setForm] = useState({ tags: [], description: '', company_type: '', domain: '', location: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { getAllMentors().then(r => setMentors(r.data)); }, []);

  const openEdit = (mentor) => {
    setEditMentor(mentor);
    setForm({
      tags: mentor.tags || [],
      description: mentor.description || '',
      company_type: mentor.company_type || '',
      domain: mentor.domain || '',
      location: mentor.location || '',
    });
    setSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMentorProfile(editMentor.id, form);
      setMentors(ms => ms.map(m => m.id === editMentor.id ? { ...m, ...form } : m));
      setSuccess('Profile updated successfully!');
    } catch { setSuccess('Failed to update.'); }
    finally { setSaving(false); }
  };

  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }));
  };

  return (
    <Layout>
      <PageHeader title="Mentors" subtitle="Manage mentor profiles, tags, and descriptions" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.map(mentor => (
          <Card key={mentor.id}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">{mentor.name}</p>
                <p className="text-xs text-gray-500">{mentor.email}</p>
              </div>
              <button
                onClick={() => openEdit(mentor)}
                className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              >
                <Edit3 size={15}/>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {mentor.tags?.map(t => <Badge key={t} label={t}/>)}
            </div>

            <div className="space-y-1.5 text-xs text-gray-500">
              {mentor.location && (
                <p className="flex items-center gap-1.5"><MapPin size={11}/> {mentor.location}</p>
              )}
              {mentor.company_type && (
                <p className="flex items-center gap-1.5"><Briefcase size={11}/> {mentor.company_type.replace(/_/g,' ')}</p>
              )}
              {mentor.domain && (
                <p className="capitalize">{mentor.domain.replace(/_/g,' ')}</p>
              )}
            </div>

            {mentor.description && (
              <p className="text-xs text-gray-600 mt-3 line-clamp-3">{mentor.description}</p>
            )}
          </Card>
        ))}
      </div>

      <Modal open={!!editMentor} onClose={() => setEditMentor(null)} title={`Edit: ${editMentor?.name}`}>
        {success && (
          <p className={`text-sm mb-4 ${success.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{success}</p>
        )}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Tags</label>
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
          {[
            { key: 'company_type', label: 'Company Type', placeholder: 'big_tech / public_company' },
            { key: 'domain', label: 'Domain', placeholder: 'e.g. backend_engineering' },
            { key: 'location', label: 'Location', placeholder: 'India / Ireland' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-700 mb-1 block">{label}</label>
              <input
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </Modal>
    </Layout>
  );
}
