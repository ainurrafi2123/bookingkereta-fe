// features/seats/components/SeatGrid.tsx
import { SeatBadge } from '@/components/ui/seat-badge';

import type { Seat } from '@/lib/types/seats';

interface SeatGridProps {
  seatMap: Record<number, Seat[]>;
  kelas: string;
  showStatus?: boolean; // ⭐ TAMBAHKAN
}

export function SeatGrid({ seatMap, kelas }: SeatGridProps) {
  // Layout config
  const is2x2 = kelas === 'eksekutif' || kelas === 'bisnis';
  const columns = is2x2 ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-4">
      {/* Header Kolom */}
      <div className="flex justify-center gap-2">
        <div className="flex gap-2">
          {columns.slice(0, is2x2 ? 2 : 3).map((col) => (
            <div key={col} className="w-14 text-center text-sm font-medium text-muted-foreground">
              {col}
            </div>
          ))}
        </div>
        <div className="w-8" /> {/* Gang tengah */}
        <div className="flex gap-2">
          {columns.slice(is2x2 ? 2 : 3).map((col) => (
            <div key={col} className="w-14 text-center text-sm font-medium text-muted-foreground">
              {col}
            </div>
          ))}
        </div>
      </div>

      {/* Seat Rows */}
      <div className="space-y-2">
        {Object.entries(seatMap).map(([baris, seats]) => (
          <div key={baris} className="flex items-center justify-center gap-2">
            {/* Nomor Baris */}
            <span className="w-8 text-sm font-medium text-muted-foreground text-right">
              {baris}
            </span>

            {/* Left Side */}
            <div className="flex gap-2">
              {seats
                .filter((s) => columns.slice(0, is2x2 ? 2 : 3).includes(s.kolom))
                .sort((a, b) => a.kolom.localeCompare(b.kolom))
                .map((seat) => (
                  <SeatBadge key={seat.no_kursi} {...seat} />
                ))}
            </div>

            {/* Gang Tengah */}
            <div className="w-8" />

            {/* Right Side */}
            <div className="flex gap-2">
              {seats
                .filter((s) => columns.slice(is2x2 ? 2 : 3).includes(s.kolom))
                .sort((a, b) => a.kolom.localeCompare(b.kolom))
                .map((seat) => (
                  <SeatBadge key={seat.no_kursi} {...seat} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}