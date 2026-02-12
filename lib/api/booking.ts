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
/**
 * Get booking receipt
 */
export interface BookingReceipt {
  perusahaan: {
    nama: string;
    npwp: string;
  };
  detail_pembayaran: {
    tanggal_pembayaran: string;
    metode_pembayaran: string;
    kode_pemesanan: string;
  };
  rincian: {
    kereta: string;
    kelas: string;
    kode_pemesanan: string;
    penumpang: {
      nama: string;
      harga: string;
    }[];
  };
  total_pembayaran: string;
  ppn_info: string;
  ppn_disclaimer: string;
  kode_pemesanan_display: string;
  pemesanan: {
    nama: string;
    no_telepon: string;
    email: string;
    tanggal_pesan: string;
    pemesanan_melalui: string;
  };
  detail_pemesanan: {
    kereta: string;
    nomor_ka: string;
    keberangkatan: string;
    tujuan: string;
  }[];
  detail_penumpang: {
    penumpang: string;
    kursi: string;
    kelas: string;
    no_identitas: string;
  }[];
  status: string;
}

export async function getBookingReceipt(
  bookingId: number
): Promise<BookingReceipt> {
  const response = await apiFetch<{ success: boolean; message: string; data: BookingReceipt }>(
    `/pembelian-tiket/${bookingId}/receipt`
  );
  return response.data;
}

export async function getBookingReceiptByCode(
  code: string
): Promise<BookingReceipt> {
  const response = await apiFetch<{ success: boolean; message: string; data: BookingReceipt }>(
    `/pembelian-tiket/kode/${code}/receipt`
  );
  return response.data;
}
