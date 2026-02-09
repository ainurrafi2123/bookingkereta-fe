import { Metadata } from 'next';
import SearchContent from './search-content';

export const metadata: Metadata = {
  title: 'Cari Jadwal Kereta Api - Tiket Kereta',
  description: 'Temukan jadwal kereta api terbaik dari berbagai stasiun di Indonesia',
};

export default function SearchPage() {
  return <SearchContent />;
}