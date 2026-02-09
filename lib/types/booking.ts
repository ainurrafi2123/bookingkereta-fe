// lib/types/booking.ts
export type PassengerCategory = 'dewasa' | 'lansia' | 'anak';

export interface Passenger {
  nik: string;
  nama: string;
  kategori: PassengerCategory;
  id_kursi: number | null;
  no_kursi?: string; // optional, untuk display saja
}

// Request payload untuk POST /api/v1/pembelian-tiket
export interface BookingRequest {
  id_penumpang: number;
  id_jadwal_kereta: number;
  penumpang: {
    nik: string;
    nama: string;
    kategori: PassengerCategory;
    id_kursi: number;
  }[];
}

// Response dari POST /api/v1/pembelian-tiket
export interface BookingResponse {
  message: string;
  data: {
    kode_tiket: string;
    tanggal_pembelian: string;
    status: string;
    total_harga: string;
    jumlah_penumpang: number;
    jadwal: {
      kereta: string;
      kelas: string;
      rute: string;
      tanggal_berangkat: string;
    };
    penumpang: {
      nama: string;
      nik: string;
      kategori: string;
      kursi: string;
      harga: string;
    }[];
  };
}

// Schedule detail untuk booking page
export interface ScheduleDetail {
  id: number;
  kode_jadwal: string;
  asal_keberangkatan: string;
  tujuan_keberangkatan: string;
  tanggal_berangkat: string;
  tanggal_kedatangan: string;
  harga_dewasa: number;
  harga_anak: number;
  harga_lansia: number;
  kursi_tersedia: number;
  kursi_terjual: number;
  status: string;
  kereta?: {
    id: number;
    nama_kereta: string;
    kelas_kereta: string;
  };
}

// Available seats response dari GET /api/v1/pembelian-tiket/jadwal/{id}/kursi-tersedia
export interface AvailableSeatsResponse {
  message: string;
  jadwal: {
    kode_jadwal: string;
    kereta: string;
    rute: string;
  };
  gerbong: {
    id_gerbong: number;
    nama_gerbong: string;
    kelas: string;
    kuota_total: number;
    kursi_tersedia: number;
    kursi: {
      id: number;
      no_kursi: string;
      baris: number;
      kolom: string;
      status: 'available' | 'booked';
    }[];
  }[];
  total_kursi_tersedia: number;
}