// lib/utils.ts atau lib/asset.ts
export function getStorageUrl(path: string | null | undefined): string {
  if (!path) return '/images/default-avatar.png'; // asset statis di public/

  const base = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  return `${base}/storage/${path.replace(/^public\//, '')}`; // hapus 'public/' kalau Laravel kirim path lengkap
}