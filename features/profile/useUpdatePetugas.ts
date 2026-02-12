// features/profile/useUpdatePetugas.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { UpdatePetugasInput, PetugasData } from '@/lib/types/profile';

interface UpdatePetugasResponse {
  message: string;
  data: PetugasData;
}

export function useUpdatePetugas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePetugas = async (
    id: number,
    data: UpdatePetugasInput
  ): Promise<PetugasData | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<UpdatePetugasResponse>(
        `/petugas/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );

      return response.data;
    } catch (err: any) {
      setError(err.message || 'Gagal mengupdate data petugas');
      console.error('Update petugas error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updatePetugas, loading, error };
}
