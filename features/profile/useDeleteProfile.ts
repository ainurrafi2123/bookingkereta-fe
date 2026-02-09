// hooks/useDeleteProfile.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';

export function useDeleteProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProfile = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch('/users/me', {
        method: 'DELETE',
      });

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return true;
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus akun');
      console.error('Delete profile error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteProfile, loading, error };
}