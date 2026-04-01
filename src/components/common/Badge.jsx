const colors = {
  tech: 'bg-blue-100 text-blue-700',
  non_tech: 'bg-gray-100 text-gray-700',
  big_company: 'bg-yellow-100 text-yellow-700',
  big_tech: 'bg-yellow-100 text-yellow-700',
  public_company: 'bg-orange-100 text-orange-700',
  senior_developer: 'bg-purple-100 text-purple-700',
  good_communication: 'bg-green-100 text-green-700',
  asks_a_lot_of_questions: 'bg-pink-100 text-pink-700',
  india: 'bg-orange-100 text-orange-700',
  ireland: 'bg-emerald-100 text-emerald-700',
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  resume_revamp: 'bg-violet-100 text-violet-700',
  job_market_guidance: 'bg-teal-100 text-teal-700',
  mock_interview: 'bg-amber-100 text-amber-700',
};

export default function Badge({ label, type }) {
  const cls = colors[type || label] || 'bg-gray-100 text-gray-600';
  const display = (label || type || '').replace(/_/g, ' ');
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cls}`}>
      {display}
    </span>
  );
}
