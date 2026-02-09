// hooks/useCreateCarriage.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { Carriage, CreateCarriageInput } from '@/lib/types/carriages';

export function useCreateCarriage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCarriage = async (data: CreateCarriageInput): Promise<Carriage | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Carriage>('/gerbong', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return response;
    } catch (err: any) {
      setError(err.message || 'Gagal membuat gerbong');
      console.error('Create carriage error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createCarriage, loading, error };
}