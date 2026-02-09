// features/seats/hooks/useSeatMap.ts
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/fetcher';
import type { SeatMapData } from '@/lib/types/seats';

export function useSeatMap(gerbongId: string | number, jadwalId?: string | number | null) {
  const [seatMap, setSeatMap] = useState<SeatMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeatMap = useCallback(async () => {
    if (!gerbongId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let endpoint = `/gerbong/${gerbongId}/seat-map`;
      if (jadwalId) {
        endpoint += `?jadwal_id=${jadwalId}`;
      }
      
      // ⭐ DEBUG: Log endpoint yang di-hit
      console.log('🔍 Fetching seat map from:', endpoint);
      
      const data = await apiFetch<SeatMapData>(endpoint);
      
      // ⭐ DEBUG: Log response
      console.log('✅ Seat map response:', data);
      
      setSeatMap(data);
    } catch (err) {
      console.error('❌ Seat map error:', err);
      
      // ⭐ DEBUG: Log full error
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      }
      
      setError(err instanceof Error ? err.message : 'Failed to fetch seat map');
    } finally {
      setLoading(false);
    }
  }, [gerbongId, jadwalId]);

  useEffect(() => {
    fetchSeatMap();
  }, [fetchSeatMap]);

  return { seatMap, loading, error, refetch: fetchSeatMap };
}