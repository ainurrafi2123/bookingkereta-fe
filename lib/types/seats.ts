// features/seats/types/index.ts

export interface Jadwal {
  id: number;
  kode_jadwal: string;
  id_kereta: number;
  tanggal_berangkat: string;
  tanggal_kedatangan: string;
  asal_keberangkatan: string;
  tujuan_keberangkatan: string;
  harga_dewasa: number;
  harga_anak: number;
  harga_lansia: number;
  kursi_tersedia: number;
  kursi_terjual: number;
  status: 'active' | 'cancelled' | 'completed';
  kereta?: {
    id: number;
    nama_kereta: string;
    kelas_kereta: string;
  };
}

export interface Seat {
  id: number;
  no_kursi: string;
  baris: number;
  kolom: string;
  status?: 'available' | 'booked'; // Optional, hanya ada jika filter jadwal
}

export interface SeatMapData {
  gerbong: string;
  kelas: string;
  jadwal_id?: number; // Optional
  total_kursi: number;
  kursi_available?: number; // Optional
  kursi_booked?: number; // Optional
  seat_map: Record<number, Seat[]>;
}

export interface Gerbong {
  id: number;
  id_kereta: number;
  nama_gerbong: string;
  kelas_gerbong: 'eksekutif' | 'bisnis' | 'ekonomi';
  kuota: number;
  kursi_count: number;
  available_count?: number; // Optional (jika ada jadwal_id)
  booked_count?: number; // Optional (jika ada jadwal_id)
  jadwal_id?: number; // Optional
  created_at: string;
  updated_at: string;
  kereta?: {
    id: number;
    kode_kereta: string;
    nama_kereta: string;
    kelas_kereta: string;
  };
}

// features/seats/types/index.ts

export interface Train {
  id: number;
  kode_kereta: string;
  nama_kereta: string;
  kelas_kereta: string;
  deskripsi?: string;
  total_gerbong: number;     // ⭐ NEW
  total_kursi: number;       // ⭐ NEW
  kursi_terbooked: number;   // ⭐ NEW
  kursi_tersedia: number;    // ⭐ NEW
  created_at: string;
  updated_at: string;
}

