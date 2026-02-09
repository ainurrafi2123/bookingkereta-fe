// lib/types/train.ts
export enum KelasKereta {
  EKONOMI = 'ekonomi',
  BISNIS = 'bisnis',
  EKSEKUTIF = 'eksekutif',
}

export interface Train {
  id: number;
  kode_kereta: string;
  nama_kereta: string;
  kelas_kereta: KelasKereta;
  deskripsi?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTrainInput {
  nama_kereta: string;
  kelas_kereta: 'ekonomi' | 'bisnis' | 'eksekutif';
  deskripsi?: string;
}

export interface UpdateTrainInput {
  nama_kereta: string;
  kelas_kereta: 'ekonomi' | 'bisnis' | 'eksekutif';
  deskripsi?: string;
}