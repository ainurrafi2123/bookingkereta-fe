// app/booking/page.tsx
import { redirect } from 'next/navigation';
import type { Route } from 'next';

export default function BookingRedirectPage() {
  // Jika akses ke /booking tanpa ID, arahkan kembali ke pencarian
  redirect('/search' as Route);
}
