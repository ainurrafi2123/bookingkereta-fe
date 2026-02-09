// features/seats/hooks/useJadwalList.ts
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/fetcher';
import type { Jadwal } from '@/lib/types/seats';

export function useJadwalList(keretaId?: string | number) {
  const [jadwals, setJadwals] = useState<Jadwal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJadwals = useCallback(async () => {
    if (!keretaId) {
      setJadwals([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // ⭐ Filter jadwal by kereta
      const data = await apiFetch<Jadwal[]>(`/jadwal-kereta?id_kereta=${keretaId}`);
      
      console.log('Jadwal for kereta', keretaId, ':', data);
      
      setJadwals(data);
    } catch (err) {
      console.error('Error fetching jadwals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch jadwals');
    } finally {
      setLoading(false);
    }
  }, [keretaId]);

  useEffect(() => {
    fetchJadwals();
  }, [fetchJadwals]);

  return { jadwals, loading, error, refetch: fetchJadwals };
}