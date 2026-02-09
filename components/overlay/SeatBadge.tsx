// features/seats/components/SeatBadge.tsx
import { Badge } from '@/components/ui/badge';

interface SeatBadgeProps {
  no_kursi: string;
  status: 'available' | 'booked';
}

export function SeatBadge({ no_kursi, status }: SeatBadgeProps) {
  return (
    <Badge 
      variant={status === 'available' ? 'default' : 'destructive'}
      className="w-14 h-10 flex items-center justify-center text-xs font-mono"
    >
      {no_kursi}
    </Badge>
  );
}