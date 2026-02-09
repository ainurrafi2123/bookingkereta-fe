export type ScheduleStatus = 'active' | 'completed' | 'cancelled' | 'maintenance';

export interface Schedule {
  id: number;
  id_kereta: number;
  kode_jadwal: string;
  asal_keberangkatan: string;
  tujuan_keberangkatan: string;
  tanggal_berangkat: string;
  tanggal_kedatangan: string;
  harga_dewasa: number;
  harga_anak: number;
  harga_lansia: number;
  status: ScheduleStatus;
  kuota_total: number;
  kursi_tersedia: number;
  kursi_terjual: number;
  created_at?: string;
  updated_at?: string;
  // Relasi
  kereta?: {
    id: number;
    kode_kereta: string;
    nama_kereta: string;
    kelas_kereta: string;
  };
}

export interface CreateScheduleInput {
  id_kereta: number;
  asal_keberangkatan: string;
  tujuan_keberangkatan: string;
  tanggal_berangkat: string;
  tanggal_kedatangan: string;
  harga_dewasa: number;
  harga_anak: number;
  harga_lansia: number;
}

export interface UpdateScheduleInput {
  tanggal_berangkat?: string;
  tanggal_kedatangan?: string;
  harga_dewasa?: number;
  harga_anak?: number;
  harga_lansia?: number;
  status?: ScheduleStatus;
}

export interface ScheduleFilters {
  id_kereta?: number;
  status?: ScheduleStatus | 'all';
  date_from?: string;
  date_to?: string;
}