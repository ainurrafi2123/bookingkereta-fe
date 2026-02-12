// lib/types/manage-booking.ts

export type BookingStatus = 'booked' | 'cancelled' | 'pending' | 'completed';

export interface BookingDetail {
  id: number;
  id_pembelian_tiket: number;
  id_kursi: number;
  nik: string;
  nama_penumpang: string;
  kategori: string;
  harga: number;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  kursi?: {
    id: number;
    no_kursi: string;
    baris: number;
    kolom: number;
    id_gerbong: number;
    gerbong?: {
      id: number;
      nama_gerbong: string;
      kelas_gerbong: string;
    };
  };
}

export interface Booking {
  id: number;
  kode_tiket: string;
  tanggal_pembelian: string;
  id_penumpang: number;
  id_jadwal_kereta: number;
  total_harga: number;
  status: BookingStatus;
  metode_pembayaran?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  pembeli?: {
    id: number;
    nama_penumpang: string;
    nik: string;
    no_hp: string;
    user?: {
      id: number;
      username: string;
      email: string;
    };
  };
  jadwal_kereta?: {
    id: number;
    kode_jadwal: string;
    asal_keberangkatan: string;
    tujuan_keberangkatan: string;
    tanggal_berangkat: string;
    tanggal_kedatangan: string;
    kereta?: {
      id: number;
      nama_kereta: string;
      kode_kereta: string;
      kelas_kereta: string;
    };
  };
  detail_pembelian?: BookingDetail[];

  // Transformed response fields from backend show()
  jadwal?: {
    id: number;
    kode: string;
    kereta: string;
    kelas: string;
    asal: string;
    tujuan: string;
    tanggal_berangkat: string;
    tanggal_tiba: string;
  };
  penumpang?: any[]; // The list of passengers from show()
  jumlah_penumpang?: number;
}

export interface BookingStatistics {
  total_transaksi: number;
  booking_aktif: number;
  booking_dibatalkan: number;
  total_pendapatan: string; // The backend returns it as a formatted string "Rp ..."
}