// lib/types/search.ts

// import { Schedule } from './schedule';

export interface SearchParams {
  from: string;           // Asal keberangkatan
  to: string;             // Tujuan
  date: string;           // Tanggal (YYYY-MM-DD)
  adults?: number;
  elderly?: number;
  youth?: number;
}

export interface SearchFilters {
  kelas?: ('ekonomi' | 'bisnis' | 'eksekutif')[];
  waktu?: string[];       // ['pagi', 'siang', 'malam']
  hargaMin?: number;
  hargaMax?: number;
  kereta?: number[];      // Filter by kereta ID
}

// export interface SearchResult {
//   schedules: Schedule[];
//   total: number;
//   filters: SearchFilters;
// }