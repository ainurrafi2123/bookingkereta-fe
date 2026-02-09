// hooks/useDeleteTrain.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';

export function useDeleteTrain() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTrain = async (trainId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch(`/kereta/${trainId}`, {
        method: 'DELETE',
      });

      return true;
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus kereta');
      console.error('Delete train error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTrain, loading, error };
}