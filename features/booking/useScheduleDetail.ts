// features/booking/useScheduleDetail.ts
import { useState, useEffect } from "react";
import { getScheduleDetail } from "@/lib/api/booking";
import type { ScheduleDetail } from "@/lib/types/booking";

export function useScheduleDetail(scheduleId: number | null) {
  const [schedule, setSchedule] = useState<ScheduleDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scheduleId) return;

    const fetchSchedule = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getScheduleDetail(scheduleId);
        setSchedule(response);
      } catch (err: any) {
        setError(err.message || "Gagal memuat detail jadwal");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

  return { schedule, isLoading, error };
}
