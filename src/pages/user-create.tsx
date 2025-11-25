import { CONFIG } from 'src/config-global';

import { CreateUserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Create User - ${CONFIG.appName}`}</title>

      <CreateUserView />
    </>
  );
}
