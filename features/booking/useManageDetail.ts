// hooks/useBookingDetail.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/fetcher';
import { Booking } from '@/lib/types/manage-booking';

export function useBookingDetail(bookingId: number | null) {
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookingDetail = useCallback(async () => {
    if (!bookingId) {
      setBooking(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<any>(`/pembelian-tiket/${bookingId}`);
      // The backend returns { message, data: { ... } }
      setBooking(response.data);
    } catch (err: any) {
      if (err.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      setError(err.message || 'Gagal memuat detail pembelian');
      console.error('Fetch booking detail error:', err);
    } finally {
      setLoading(false);
    }
  }, [bookingId, router]);

  useEffect(() => {
    fetchBookingDetail();
  }, [fetchBookingDetail]);

  return {
    booking,
    loading,
    error,
    refetch: fetchBookingDetail,
  };
}