import { Helmet } from 'react-helmet-async';

import { TimeBlockNameCreateEditView } from 'src/sections/time-block-name/view';

// ----------------------------------------------------------------------

const metadata = { title: 'Create Time Block Name' };

export default function TimeBlockNameCreatePage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TimeBlockNameCreateEditView />
    </>
  );
}
