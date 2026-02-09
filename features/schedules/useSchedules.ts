// hooks/useSchedules.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { Schedule, ScheduleFilters } from '@/lib/types/schedules';

export function useSchedules(filters?: ScheduleFilters) {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const idKereta = filters?.id_kereta;
  const status = filters?.status;

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (idKereta) params.append('id_kereta', idKereta.toString());
      if (status && status !== 'all') params.append('status', status);

      const endpoint = `/jadwal-kereta${params.toString() ? `?${params}` : ''}`;
      const response = await apiFetch<Schedule[]>(endpoint);

      setSchedules(response || []);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.clear();
        router.push('/login');
        return;
      }
      setError(err.message || 'Gagal memuat data jadwal');
    } finally {
      setLoading(false);
    }
  }, [idKereta, status, router]); // ✅ primitive only

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return { schedules, loading, error, refetch: fetchSchedules };
}
