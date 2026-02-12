// hooks/useBookings.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { Booking } from '@/lib/types/manage-booking';

export function useBookings(filters?: {
  tanggal?: string | undefined;
  bulan?: string | undefined;
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
      const queryParams = new URLSearchParams();
      if (filters?.tanggal) queryParams.append('tanggal', filters.tanggal);
      if (filters?.bulan) queryParams.append('bulan', filters.bulan);

      const queryString = queryParams.toString();
      const url = `/pembelian-tiket${queryString ? `?${queryString}` : ''}`;

      const response = await apiFetch<any>(url);
      // The backend returns { message, data: { data: [...] } } for paginated results
      setBookings(response.data?.data || []);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      setError(err.message || 'Gagal memuat data pembelian tiket');
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  }, [router, filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
}