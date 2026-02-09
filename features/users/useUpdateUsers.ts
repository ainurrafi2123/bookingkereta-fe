// hooks/useUpdateUser.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { User } from '@/lib/types/user';

interface UpdateUserInput {
  username?: string;
  email?: string;
  role?: 'petugas' | 'penumpang';
  profile_photo?: string;
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (userId: number, data: UpdateUserInput): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<User>(`/users/${userId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return response;
    } catch (err: any) {
      setError(err.message || 'Gagal mengupdate user');
      console.error('Update user error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}