// hooks/useUserDetail.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { UserWithDetail } from '@/lib/types/user';

export function useUserDetail(userId: number | null) {
  const router = useRouter();
  const [user, setUser] = useState<UserWithDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetail = useCallback(async () => {
    if (!userId) {
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<UserWithDetail>(`/users/${userId}`);
      setUser(response);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      setError(err.message || 'Gagal memuat detail user');
      console.error('Fetch user detail error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    fetchUserDetail();
  }, [fetchUserDetail]);

  // Return refetch function untuk manual refresh
  return { 
    user, 
    loading, 
    error,
    refetch: fetchUserDetail 
  };
}