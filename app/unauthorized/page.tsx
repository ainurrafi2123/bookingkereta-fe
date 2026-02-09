// app/unauthorized/page.tsx
import { notFound } from 'next/navigation';

export default function Unauthorized() {
  notFound(); // ← ini akan render not-found.tsx dan kasih status 404
}