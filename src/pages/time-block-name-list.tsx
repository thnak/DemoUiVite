import { CONFIG } from 'src/config-global';

import { TimeBlockNameListView } from 'src/sections/time-block-name/view';

// ----------------------------------------------------------------------

export default function TimeBlockNameListPage() {
  return (
    <>
      <title>{`Time Block Name List - ${CONFIG.appName}`}</title>

      <TimeBlockNameListView />
    </>
  );
}
