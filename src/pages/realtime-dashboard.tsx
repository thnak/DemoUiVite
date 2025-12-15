import { Helmet } from 'react-helmet-async';

import { RealtimeProvider } from 'src/services/realtime';

import { RealtimeDashboardView } from 'src/sections/realtime-dashboard/view';

// ----------------------------------------------------------------------

export default function RealtimeDashboardPage() {
  return (
    <>
      <Helmet>
        <title>Real-Time Dashboard - Research Implementation</title>
      </Helmet>

      <RealtimeProvider hubUrl="/hubs/metrics" useMockData>
        <RealtimeDashboardView />
      </RealtimeProvider>
    </>
  );
}
