// hooks/useBookingStatistics.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { BookingStatistics } from '@/lib/types/manage-booking';

export function useBookingStatistics() {
  const router = useRouter();
  const [statistics, setStatistics] = useState<BookingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<any>('/pembelian-tiket/statistics/data');
      // The backend returns { message, data: { total_transaksi, ... } }
      setStatistics(response.data);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      setError(err.message || 'Gagal memuat statistik');
      console.error('Fetch statistics error:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
}