// hooks/useSearchSchedules.ts
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { Schedule } from '@/lib/types/schedules';
import { SearchParams, SearchFilters } from '@/lib/types/search';

/**
 * Normalize tanggal dari API
 * Support:
 * - ISO: 2026-02-18T18:00:00.000Z
 * - SQL: 2026-02-19 01:00:00
 */
function extractDate(dateTime: string): string {
  if (!dateTime) return '';
  if (dateTime.includes('T')) {
    return dateTime.split('T')[0]; // YYYY-MM-DD
  }
  return dateTime.split(' ')[0]; // YYYY-MM-DD
}

/**
 * Ambil jam TANPA timezone conversion
 */
function extractHour(dateTime: string): number {
  if (!dateTime) return 0;

  if (dateTime.includes('T')) {
    // ISO: ambil jam mentah
    return parseInt(dateTime.split('T')[1].substring(0, 2), 10);
  }

  // SQL
  return parseInt(dateTime.split(' ')[1].split(':')[0], 10);
}

export function useSearchSchedules(searchParams: SearchParams) {
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedules from API
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<Schedule[]>(
        '/jadwal-kereta?status=active'
      );

      // Filter by route + date
      const filtered = response.filter((schedule) => {
        const matchFrom = schedule.asal_keberangkatan
          ?.toLowerCase()
          .includes(searchParams.from.toLowerCase());

        const matchTo = schedule.tujuan_keberangkatan
          ?.toLowerCase()
          .includes(searchParams.to.toLowerCase());

        const scheduleDate = extractDate(schedule.tanggal_berangkat);
        const matchDate = scheduleDate === searchParams.date;

        return matchFrom && matchTo && matchDate;
      });

      setAllSchedules(filtered);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat jadwal');
      console.error('Search schedules error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchParams.from, searchParams.to, searchParams.date]);

  useEffect(() => {
    if (searchParams.from && searchParams.to && searchParams.date) {
      fetchSchedules();
    }
  }, [fetchSchedules, searchParams.from, searchParams.to, searchParams.date]);

  // Apply client-side filters
  const filteredSchedules = useMemo(() => {
    let result = [...allSchedules];

    // Filter by kelas
    if (filters.kelas && filters.kelas.length > 0) {
      result = result.filter(
        (s) =>
          s.kereta?.kelas_kereta &&
          filters.kelas!.includes(s.kereta.kelas_kereta as any)
      );
    }

    // Filter by waktu (pagi / siang / malam)
    if (filters.waktu && filters.waktu.length > 0) {
      result = result.filter((schedule) => {
        const hour = extractHour(schedule.tanggal_berangkat);

        return filters.waktu!.some((w) => {
          if (w === 'pagi' && hour >= 0 && hour < 12) return true;
          if (w === 'siang' && hour >= 12 && hour < 18) return true;
          if (w === 'malam' && hour >= 18 && hour < 24) return true;
          return false;
        });
      });
    }

    // Filter by harga
    if (filters.hargaMin !== undefined) {
      result = result.filter((s) => s.harga_dewasa >= filters.hargaMin!);
    }
    if (filters.hargaMax !== undefined) {
      result = result.filter((s) => s.harga_dewasa <= filters.hargaMax!);
    }

    // Sort by tanggal + jam (AMAN, TANPA Date())
    result.sort((a, b) =>
      a.tanggal_berangkat.localeCompare(b.tanggal_berangkat)
    );

    return result;
  }, [allSchedules, filters]);

  return {
    schedules: filteredSchedules,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchSchedules,
  };
}
