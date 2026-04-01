import Layout from '../../components/common/Layout';
import PageHeader from '../../components/common/PageHeader';
import AvailabilityManager from '../../components/common/AvailabilityManager';

export default function UserAvailability() {
  return (
    <Layout>
      <PageHeader title="My Availability" subtitle="Set the times you're available for mentoring calls" />
      <AvailabilityManager />
    </Layout>
  );
}
