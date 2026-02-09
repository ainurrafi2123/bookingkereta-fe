// features/booking/useAvailableSeats.ts
import { useState, useEffect } from "react";
import { getAvailableSeats } from "@/lib/api/booking";
import type { AvailableSeatsResponse } from "@/lib/types/booking";

export function useAvailableSeats(scheduleId: number | null) {
  const [seatsData, setSeatsData] = useState<AvailableSeatsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    if (!scheduleId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getAvailableSeats(scheduleId);
      setSeatsData(response);
    } catch (err: any) {
      setError(err.message || "Gagal memuat kursi tersedia");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [scheduleId]);

  return { seatsData, isLoading, error, refetch };
}
