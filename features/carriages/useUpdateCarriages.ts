// hooks/useUpdateCarriage.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { Carriage, UpdateCarriageInput } from '@/lib/types/carriages';

export function useUpdateCarriage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCarriage = async (
    carriageId: number,
    data: UpdateCarriageInput
  ): Promise<Carriage | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Carriage>(`/gerbong/${carriageId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      return response;
    } catch (err: any) {
      setError(err.message || 'Gagal mengupdate gerbong');
      console.error('Update carriage error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateCarriage, loading, error };
}