import { useParams } from 'react-router-dom';

import { _areas } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { AreaCreateEditView } from 'src/sections/area/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { id } = useParams();

  const currentArea = _areas.find((area) => area.id === id);

  return (
    <>
      <title>{`Edit Area - ${CONFIG.appName}`}</title>

      <AreaCreateEditView
        isEdit
        currentArea={
          currentArea
            ? {
                id: currentArea.id,
                name: currentArea.name,
                description: currentArea.description,
              }
            : undefined
        }
      />
    </>
  );
}
