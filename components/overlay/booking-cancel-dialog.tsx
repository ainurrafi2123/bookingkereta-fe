// components/bookings/booking-cancel-dialog.tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCancelBooking } from '@/features/booking/useCancelBooking'
import { Booking } from '@/lib/types/manage-booking';
import { Loader2, AlertTriangle } from 'lucide-react';

interface BookingCancelDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BookingCancelDialog({
  booking,
  open,
  onOpenChange,
  onSuccess,
}: BookingCancelDialogProps) {
  const { cancelBooking, loading } = useCancelBooking();

  const handleCancel = async () => {
    if (!booking) return;

    const success = await cancelBooking(booking.id);

    if (success) {
      onOpenChange(false);
      onSuccess();
    }
  };

  if (!booking) return null;

  // In backend, 'booked' means it's valid and can be cancelled
  const canCancel = booking.status === 'pending' || booking.status === 'booked';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Batalkan Pemesanan?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin membatalkan pemesanan dengan kode{' '}
            <span className="font-semibold font-mono">{booking.kode_tiket}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!canCancel && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Pemesanan dengan status <strong>{booking.status}</strong> tidak dapat
              dibatalkan.
            </AlertDescription>
          </Alert>
        )}

        {booking.status === 'booked' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Perhatian:</strong> Pembatalan pemesanan yang sudah terkonfirmasi
              mungkin akan dikenakan biaya pembatalan sesuai kebijakan yang berlaku.
            </AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Tidak</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={loading || !canCancel}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Membatalkan...
              </>
            ) : (
              'Ya, Batalkan'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}