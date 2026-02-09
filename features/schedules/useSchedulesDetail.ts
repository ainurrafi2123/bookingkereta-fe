// hooks/useScheduleDetail.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { Schedule } from '@/lib/types/schedules';

export function useScheduleDetail(scheduleId: number | null) {
  const router = useRouter();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScheduleDetail = useCallback(async () => {
    if (!scheduleId) {
      setSchedule(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Schedule>(`/jadwal-kereta/${scheduleId}`);
      setSchedule(response);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      setError(err.message || 'Gagal memuat detail jadwal');
      console.error('Fetch schedule detail error:', err);
    } finally {
      setLoading(false);
    }
  }, [scheduleId, router]);

  useEffect(() => {
    fetchScheduleDetail();
  }, [fetchScheduleDetail]);

  return {
    schedule,
    loading,
    error,
    refetch: fetchScheduleDetail,
  };
}