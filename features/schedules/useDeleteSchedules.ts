// hooks/useDeleteSchedule.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';

export function useDeleteSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSchedule = async (scheduleId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch(`/jadwal-kereta/${scheduleId}`, {
        method: 'DELETE',
      });

      return true;
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus jadwal');
      console.error('Delete schedule error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteSchedule, loading, error };
}