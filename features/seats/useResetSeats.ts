// features/seats/hooks/useResetSeats.ts
import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/fetcher';

export function useResetSeats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(async (gerbongId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/gerbong/${gerbongId}/reset-kursi`, {
        method: 'DELETE',
      });
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to reset seats';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reset, loading, error };
}