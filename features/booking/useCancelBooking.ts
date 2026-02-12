// hooks/useCancelBooking.ts
'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { Booking } from '@/lib/types/manage-booking';
import { toast } from 'sonner';

export function useCancelBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelBooking = async (bookingId: number): Promise<Booking | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Booking>(`/pembelian-tiket/${bookingId}/cancel`, {
        method: 'PUT',
      });

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal membatalkan pembelian';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { cancelBooking, loading, error };
}