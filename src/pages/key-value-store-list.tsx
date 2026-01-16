import { CONFIG } from 'src/config-global';

import { KeyValueStoreListView } from 'src/sections/key-value-store/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Key-Value Store - ${CONFIG.appName}`}</title>

      <KeyValueStoreListView />
    </>
  );
}
