// hooks/useUsers.ts
'use client';

import { useEffect, useState, useCallback } from 'react'; 
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { User } from '@/lib/types/user';

export function useUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<User[]>('/users');
      setUsers(response || []);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      setError(err.message || 'Gagal memuat daftar pengguna');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  }, [router]); 


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); 


  return { users, loading, error, refetch: fetchUsers };
}
