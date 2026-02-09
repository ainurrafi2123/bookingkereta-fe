// hooks/useCarriageDetail.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { Carriage } from '@/lib/types/carriages';

export function useCarriageDetail(carriageId: number | null) {
  const router = useRouter();
  const [carriage, setCarriage] = useState<Carriage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCarriageDetail = useCallback(async () => {
    if (!carriageId) {
      setCarriage(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Carriage>(`/gerbong/${carriageId}`);
      setCarriage(response);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      setError(err.message || 'Gagal memuat detail gerbong');
      console.error('Fetch carriage detail error:', err);
    } finally {
      setLoading(false);
    }
  }, [carriageId, router]);

  useEffect(() => {
    fetchCarriageDetail();
  }, [fetchCarriageDetail]);

  return {
    carriage,
    loading,
    error,
    refetch: fetchCarriageDetail,
  };
}