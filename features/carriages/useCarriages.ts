// hooks/useCarriages.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { Carriage } from '@/lib/types/carriages';

export function useCarriages() {
  const router = useRouter();
  const [carriages, setCarriages] = useState<Carriage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCarriages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Carriage[]>('/gerbong');
      setCarriages(response || []);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      setError(err.message || 'Gagal memuat data gerbong');
      console.error('Fetch carriages error:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCarriages();
  }, [fetchCarriages]);

  return {
    carriages,
    loading,
    error,
    refetch: fetchCarriages,
  };
}