import { CONFIG } from 'src/config-global';

import { TimeBlockNameCreateEditView } from 'src/sections/time-block-name/view';

// ----------------------------------------------------------------------

export default function TimeBlockNameEditPage() {
  return (
    <>
      <title>{`Edit Time Block Name - ${CONFIG.appName}`}</title>

      <TimeBlockNameCreateEditView isEdit />
    </>
  );
}
