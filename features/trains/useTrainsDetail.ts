// hooks/useTrainDetail.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { Train } from '@/lib/types/trains';

export function useTrainDetail(trainId: number | null) {
  const router = useRouter();
  const [train, setTrain] = useState<Train | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainDetail = useCallback(async () => {
    if (!trainId) {
      setTrain(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Train>(`/kereta/${trainId}`);
      setTrain(response);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      setError(err.message || 'Gagal memuat detail kereta');
      console.error('Fetch train detail error:', err);
    } finally {
      setLoading(false);
    }
  }, [trainId, router]);

  useEffect(() => {
    fetchTrainDetail();
  }, [fetchTrainDetail]);

  return {
    train,
    loading,
    error,
    refetch: fetchTrainDetail,
  };
}