import Layout from '../../components/common/Layout';
import PageHeader from '../../components/common/PageHeader';
import AvailabilityManager from '../../components/common/AvailabilityManager';

export default function MentorAvailability() {
  return (
    <Layout>
      <PageHeader title="My Availability" subtitle="Set your weekly availability for mentoring sessions" />
      <AvailabilityManager />
    </Layout>
  );
}
