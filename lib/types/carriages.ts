// lib/types/carriage.ts

export interface Carriage {
  id: number;
  id_kereta: number;
  nama_gerbong: string;
  kelas_gerbong: 'ekonomi' | 'bisnis' | 'eksekutif';
  kuota: number;
  created_at?: string;
  updated_at?: string;
  // Relasi dengan kereta
  kereta?: {
    id: number;
    kode_kereta: string;
    nama_kereta: string;
    kelas_kereta: string;
  };
}

export interface CreateCarriageInput {
  id_kereta: number;
  nama_gerbong: string;
  kelas_gerbong: 'ekonomi' | 'bisnis' | 'eksekutif';
  kuota: number;
}

export interface UpdateCarriageInput {
  nama_gerbong?: string;
  kelas_gerbong?: 'ekonomi' | 'bisnis' | 'eksekutif';
  kuota?: number;
}