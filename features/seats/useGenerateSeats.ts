// features/seats/hooks/useGenerateSeats.ts
import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/fetcher';

export function useGenerateSeats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (gerbongId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/gerbong/${gerbongId}/generate-kursi`, {
        method: 'POST',
      });
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate seats';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generate, loading, error };
}