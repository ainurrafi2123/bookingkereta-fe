// features/seats/hooks/useGerbongByTrain.ts
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/fetcher';
import type { Gerbong } from '@/lib/types/seats';

export function useGerbongByTrain(keretaId: string | number, jadwalId?: string | number | null) {
  const [gerbongs, setGerbongs] = useState<Gerbong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGerbongs = useCallback(async () => {
    if (!keretaId) {
      setGerbongs([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // ⭐ Tambah jadwal_id sebagai query param (optional)
      let endpoint = `/gerbong?id_kereta=${keretaId}`;
      if (jadwalId) {
        endpoint += `&jadwal_id=${jadwalId}`;
      }
      
      console.log('Fetching gerbongs:', endpoint);
      
      const data = await apiFetch<Gerbong[]>(endpoint);
      
      console.log('Gerbongs data:', data);
      
      setGerbongs(data);
    } catch (err) {
      console.error('Error fetching gerbongs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch gerbongs');
    } finally {
      setLoading(false);
    }
  }, [keretaId, jadwalId]);

  useEffect(() => {
    fetchGerbongs();
  }, [fetchGerbongs]);

  return { gerbongs, loading, error, refetch: fetchGerbongs };
}