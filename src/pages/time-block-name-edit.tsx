import { Helmet } from 'react-helmet-async';

import { TimeBlockNameCreateEditView } from 'src/sections/time-block-name/view';

// ----------------------------------------------------------------------

const metadata = { title: 'Edit Time Block Name' };

export default function TimeBlockNameEditPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TimeBlockNameCreateEditView isEdit />
    </>
  );
}
