import { CONFIG } from 'src/config-global';

import { RoleCreateEditView } from 'src/sections/role/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create Role - ${CONFIG.appName}`}</title>

      <RoleCreateEditView />
    </>
  );
}
