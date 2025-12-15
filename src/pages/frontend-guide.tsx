import { Helmet } from 'react-helmet-async';

import { FrontendGuideView } from 'src/sections/frontend-guide';

// ----------------------------------------------------------------------

export default function FrontendGuidePage() {
  return (
    <>
      <Helmet>
        <title>Frontend Developer Guide - Real-Time Dashboard</title>
      </Helmet>

      <FrontendGuideView />
    </>
  );
}
