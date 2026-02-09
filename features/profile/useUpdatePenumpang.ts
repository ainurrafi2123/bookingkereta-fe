// hooks/useUpdatePenumpang.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { UpdatePenumpangInput, PenumpangData } from '@/lib/types/profile';

interface UpdatePenumpangResponse {
  message: string;
  data: PenumpangData;
}

export function useUpdatePenumpang() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePenumpang = async (
    data: UpdatePenumpangInput
  ): Promise<PenumpangData | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<UpdatePenumpangResponse>(
        '/penumpang/me',
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      return response.data;
    } catch (err: any) {
      setError(err.message || 'Gagal mengupdate data penumpang');
      console.error('Update penumpang error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updatePenumpang, loading, error };
}