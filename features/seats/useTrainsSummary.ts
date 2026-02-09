// features/seats/hooks/useTrainsSummary.ts
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/fetcher';

interface Train {
  id: number;
  nama_kereta: string;
  kelas_kereta: string;
  total_gerbong: number;
  total_kursi: number;
  kursi_tersedia: number;
  kursi_terbooked: number;
}

export function useTrainsSummary() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrains = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Train[]>('/kereta'); // Adjust endpoint
      setTrains(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trains');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrains();
  }, [fetchTrains]);

  return { trains, loading, error, refetch: fetchTrains };
}