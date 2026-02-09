// hooks/useDeleteCarriage.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';

export function useDeleteCarriage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCarriage = async (carriageId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch(`/gerbong/${carriageId}`, {
        method: 'DELETE',
      });

      return true;
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus gerbong');
      console.error('Delete carriage error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCarriage, loading, error };
}