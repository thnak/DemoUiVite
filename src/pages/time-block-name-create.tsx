import { CONFIG } from 'src/config-global';

import { TimeBlockNameCreateEditView } from 'src/sections/time-block-name/view';

// ----------------------------------------------------------------------

export default function TimeBlockNameCreatePage() {
  return (
    <>
      <title>{`Create Time Block Name - ${CONFIG.appName}`}</title>

      <TimeBlockNameCreateEditView />
    </>
  );
}
