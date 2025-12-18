import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ChangeProductView } from 'src/sections/oi/change-product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Change Product | OI - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ChangeProductView />
    </>
  );
}
