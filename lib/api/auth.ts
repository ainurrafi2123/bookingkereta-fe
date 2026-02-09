// lib/api/auth.ts
import { apiFetch } from "../fetcher";
// import { tokenStorage } from "../storage/auth";
import type { RegisterInput, LoginInput } from "../schema/auth";

interface AuthResponse {
  token: string;
  user: {
    id: number;
    username?: string;
    name?: string;
    email: string;
    role: string;           // "petugas" | "user" | dll
    profile_photo?: string | null;
  };
  message?: string;
}

// ── Register (sudah ada sebelumnya) ──
export async function registerUser(
  data: RegisterInput
): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return response;
}

// ── Login ──
export async function loginUser(
  credentials: LoginInput
): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  // Di sini kita kembalikan response utuh → hook yang akan handle redirect + simpan user info
  return response;
}

  export async function logoutUser(): Promise<void> {
    await apiFetch("/auth/logout", {
      method: "POST",
    });
  }
