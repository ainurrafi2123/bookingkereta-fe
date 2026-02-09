// hooks/useCreateSchedule.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { Schedule, CreateScheduleInput } from '@/lib/types/schedules';

export function useCreateSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSchedule = async (data: CreateScheduleInput): Promise<Schedule | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Schedule>('/jadwal-kereta', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return response;
    } catch (err: any) {
      setError(err.message || 'Gagal membuat jadwal');
      console.error('Create schedule error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createSchedule, loading, error };
}