// hooks/useUpdateSchedule.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { Schedule, UpdateScheduleInput } from '@/lib/types/schedules';

export function useUpdateSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSchedule = async (
    scheduleId: number,
    data: UpdateScheduleInput
  ): Promise<Schedule | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Schedule>(`/jadwal-kereta/${scheduleId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      return response;
    } catch (err: any) {
      setError(err.message || 'Gagal mengupdate jadwal');
      console.error('Update schedule error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateSchedule, loading, error };
}