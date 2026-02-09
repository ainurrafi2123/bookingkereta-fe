// features/booking/useCreateBooking.ts
import { useState } from "react";
import { createBooking } from "@/lib/api/booking";
import type { BookingRequest, BookingResponse } from "@/lib/types/booking";

export function useCreateBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BookingResponse | null>(null);

  const submit = async (payload: BookingRequest) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await createBooking(payload);
      setData(response);
      return response;
    } catch (err: any) {
      const errorMessage =
        err.message || "Gagal membuat booking. Silakan coba lagi.";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setData(null);
  };

  return { submit, isLoading, error, data, reset };
}
