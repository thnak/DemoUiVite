import { Helmet } from 'react-helmet-async';

import { TimeBlockNameListView } from 'src/sections/time-block-name/view';

// ----------------------------------------------------------------------

const metadata = { title: 'Time Block Name List' };

export default function TimeBlockNameListPage() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TimeBlockNameListView />
    </>
  );
}
