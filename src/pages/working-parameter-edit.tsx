import { useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { WorkingParameterCreateEditView } from 'src/sections/working-parameter/view/working-parameter-edit-view';

import { getWorkingParameterById } from '../api';

type ApiWorkingParameter = {
  id: string;
  machineId: string;
  productId: string;
  idealCycleTime?: string | null;
  downtimeThreshold?: string | null;
  speedLossThreshold?: string | null;
  quantityPerCycle?: number | null;
};

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiWorkingParameter | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!id) {
      return () => {
        alive = false;
      };
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getWorkingParameterById(id); // res: WorkingParameterEntity

        if (!alive) return;

        // ✅ normalize (ép về type bạn cần) + bắt lỗi nếu thiếu id
        const normalized: ApiWorkingParameter = {
          id: res.id  ?? id, // ưu tiên id từ api; fallback _id; cuối cùng fallback route id
          machineId: res.machineId  ?? '',
          productId: res.productId ??  '',
          idealCycleTime: res.idealCycleTime ?? null,
          downtimeThreshold: res.downtimeThreshold ?? null,
          speedLossThreshold: res.speedLossThreshold ?? null,
          quantityPerCycle: res.quantityPerCycle ?? null,
        };

        if (!normalized.id) throw new Error('WorkingParameter is missing id');
        setData(normalized);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? 'Failed to load working parameter');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const currentWorkingParameter = useMemo(() => {
    if (!data) return undefined;

    return {
      id: data.id,
      machine: data.machineId,
      product: data.productId,
      idealCycleTime: data.idealCycleTime ?? null,
      downtimeThreshold: data.downtimeThreshold ?? null,
      speedLossThreshold: data.speedLossThreshold ?? null,
      quantityPerCycle: data.quantityPerCycle != null ? String(data.quantityPerCycle) : null,
    };
  }, [data]);

  return (
    <DashboardContent>
      <title>{`Edit Working Parameter - ${CONFIG.appName}`}</title>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && currentWorkingParameter && (
        <WorkingParameterCreateEditView isEdit currentWorkingParameter={currentWorkingParameter} />
      )}
    </DashboardContent>
  );
}
