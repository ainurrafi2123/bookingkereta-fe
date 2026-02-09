// hooks/useCreateTrain.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { Train, CreateTrainInput } from '@/lib/types/trains';

export function useCreateTrain() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTrain = async (data: CreateTrainInput): Promise<Train | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<{ message: string; data: Train }>('/kereta', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return response.data;
    } catch (err: any) {
      setError(err.message || 'Gagal membuat kereta');
      console.error('Create train error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTrain, loading, error };
}