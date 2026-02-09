// hooks/useDeleteUser.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (userId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch(`/users/${userId}`, {
        method: 'DELETE',
      });

      return true;
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus user');
      console.error('Delete user error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
}