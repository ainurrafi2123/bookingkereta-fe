'use client';

import { useState, useMemo } from 'react';
import { BookingStatsCards } from '@/components/content/booking-stats-card';
import { BookingsDataTable } from '@/components/layout/bookings-data-table';
import { useBookings } from '@/features/booking/useManageBooking';
import { useBookingStatistics } from '@/features/booking/useBookingStatistic';
import { format } from 'date-fns';

export default function BookingsPage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<string | undefined>(undefined);

  const filters = useMemo(() => ({
    tanggal: date ? format(date, 'yyyy-MM-dd') : undefined,
    bulan: month,
  }), [date, month]);

  const {
    bookings,
    loading: bookingsLoading,
    refetch: refetchBookings,
  } = useBookings(filters);
  
  const {
    statistics,
    loading: statsLoading,
    refetch: refetchStats,
  } = useBookingStatistics();

  const handleRefresh = () => {
    refetchBookings();
    refetchStats();
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Pemesanan</h2>
      </div>

      <BookingStatsCards
        statistics={statistics}
        loading={statsLoading}
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">Daftar Transaksi</h3>
          <p className="text-sm text-muted-foreground">
            Kelola dan pantau semua transaksi tiket kereta api.
          </p>
        </div>
        <BookingsDataTable
          data={bookings}
          loading={bookingsLoading || statsLoading}
          onRefresh={handleRefresh}
          date={date}
          setDate={setDate}
          month={month}
          setMonth={setMonth}
        />
      </div>
    </div>
  );
}
