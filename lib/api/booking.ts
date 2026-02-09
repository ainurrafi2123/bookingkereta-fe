// lib/api/booking.ts
import { apiFetch } from "../fetcher";
import type {
  BookingRequest,
  BookingResponse,
  ScheduleDetail,
  AvailableSeatsResponse,
} from "../types/booking";

/**
 * Get schedule detail by ID
 */
export async function getScheduleDetail(
  scheduleId: number
): Promise<ScheduleDetail> {
  return apiFetch<ScheduleDetail>(
    `/jadwal-kereta/${scheduleId}`
  );
}

/**
 * Get available seats for a schedule
 */
export async function getAvailableSeats(
  scheduleId: number
): Promise<AvailableSeatsResponse> {
  return apiFetch<AvailableSeatsResponse>(
    `/pembelian-tiket/jadwal/${scheduleId}/kursi-tersedia`
  );
}

/**
 * Create a new booking
 */
export async function createBooking(
  payload: BookingRequest
): Promise<BookingResponse> {
  return apiFetch<BookingResponse>("/pembelian-tiket", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
