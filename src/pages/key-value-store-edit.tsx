import { CONFIG } from 'src/config-global';

import { KeyValueStoreCreateEditView } from 'src/sections/key-value-store/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Edit Key-Value Store - ${CONFIG.appName}`}</title>

      <KeyValueStoreCreateEditView isEdit />
    </>
  );
}
