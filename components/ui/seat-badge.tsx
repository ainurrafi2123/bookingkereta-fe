// 
import { Badge } from '@/components/ui/badge';

// components/ui/seat-badge.tsx
export interface SeatBadgeProps {
  no_kursi: string;
  kolom: string;
  status?: 'available' | 'booked';
}


export function SeatBadge({ no_kursi, status }: SeatBadgeProps) {
  return (
    <Badge 
      variant={status === 'available' ? 'default' : 'destructive'}
      className="w-14 h-10 flex items-center justify-center text-xs font-mono rounded-sm"
    >
      {no_kursi}
    </Badge>
  );
}