// lib/types/profile.ts

export interface PenumpangData {
  id: number;
  user_id: number;
  nik?: string | null;
  nama_penumpang?: string | null;
  alamat?: string | null;
  no_hp?: string | null;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    profile_photo?: string | null;
  };
}

export interface PetugasData {
  id: number;
  user_id: number;
  nip?: string;
  nama_petugas?: string;
  nik?: string;
  alamat?: string;
  no_hp?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileResponse {
  role: 'penumpang' | 'petugas' | 'user';
  data: PenumpangData | PetugasData | any;
}

// ✅ Export yang diperlukan
export interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
  profile_photo?: File;
}

export interface UpdatePenumpangInput {
  nama_penumpang?: string;
  nik?: string;
  alamat?: string;
  no_hp?: string;
}

export interface UpdatePetugasInput {
  nama_petugas?: string;
  nik?: string;
  alamat?: string;
  no_hp?: string;
}

// Alias untuk backward compatibility (jika ada yang masih pakai nama lama)
export type UpdateProfileInput = UpdateUserInput;