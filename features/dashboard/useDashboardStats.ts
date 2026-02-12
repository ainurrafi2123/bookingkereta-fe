// features/dashboard/useDashboardStats.ts
'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/fetcher';
import { DashboardStats, DashboardStatsResponse } from '@/lib/types/dashboard-types';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch<DashboardStatsResponse>('/stats/dashboard');
        
        if (response.success) {
          setStats(response.data);
        } else {
          throw new Error('Failed to fetch dashboard stats');
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memuat statistik dashboard');
        console.error('Fetch dashboard stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
