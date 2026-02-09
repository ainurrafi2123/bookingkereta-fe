// lib/types/user.ts

export interface User {
  id: number;
  username: string | null;
  name: string | null;
  email: string;
  role: 'petugas' | 'penumpang';
  profile_photo: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PenumpangDetail {
  id: number;
  user_id: number;
  nik: string;
  nama_penumpang: string;
  alamat: string;
  no_hp: string;
  created_at?: string;
  updated_at?: string;
}

export interface PetugasDetail {
  id: number;
  user_id: number;
  nik: string;
  nama_petugas: string;
  alamat: string;
  no_hp: string;
  created_at?: string;
  updated_at?: string;
}

// ✅ FIX: Tambahkan penumpang & petugas sebagai optional properties
export interface UserWithDetail extends User {
  penumpang?: PenumpangDetail | null;  // ← Harus optional & nullable
  petugas?: PetugasDetail | null;      // ← Harus optional & nullable
}