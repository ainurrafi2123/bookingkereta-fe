// lib/fetcher.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
const API_BASE_URL_PHOTO = process.env.NEXT_PUBLIC_STORAGE_URL || "http://127.0.0.1:8000/storage";

interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Helper function untuk mendapatkan full URL foto
export function getPhotoUrl(
  path?: string | null
): string {
  // fallback default avatar
  if (!path) return "default-avatar.png";

  // Jika sudah full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Hindari double slash
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${API_BASE_URL_PHOTO}/${cleanPath}`;
}


export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  // Ambil token dari localStorage (hanya berjalan di client-side)
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  // Siapkan headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    // credentials: 'include' bisa ditambahkan kalau nanti balik ke cookie mode
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error: ApiError = {
      message: data?.message || "Terjadi kesalahan pada server",
      status: response.status,
      errors: data?.errors,
    };
    throw error;
  }

  return data as T;
}