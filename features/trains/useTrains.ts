// hooks/useTrains.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { Train } from '@/lib/types/trains';

export function useTrains() {
  const router = useRouter();
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrains = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Train[]>('/kereta');
      setTrains(response || []);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      setError(err.message || 'Gagal memuat data kereta');
      console.error('Fetch trains error:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTrains();
  }, [fetchTrains]);

  return {
    trains,
    loading,
    error,
    refetch: fetchTrains,
  };
}