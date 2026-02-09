// hooks/useUpdateTrain.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { Train, UpdateTrainInput } from '@/lib/types/trains';

export function useUpdateTrain() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTrain = async (
    trainId: number,
    data: UpdateTrainInput
  ): Promise<Train | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<{ message: string; data: Train }>(
        `/kereta/${trainId}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      return response.data;
    } catch (err: any) {
      setError(err.message || 'Gagal mengupdate kereta');
      console.error('Update train error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateTrain, loading, error };
}