// features/seats/components/ResetSeatButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useResetSeats } from '@/features/seats/useResetSeats';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ResetSeatButtonProps {
  gerbongId: number;
  gerbongName: string;
  onSuccess?: () => void;
}

export function ResetSeatButton({ gerbongId, gerbongName, onSuccess }: ResetSeatButtonProps) {
  const { reset, loading } = useResetSeats();

  const handleReset = async () => {
    try {
      await reset(gerbongId);
      toast.success('Kursi berhasil direset!');
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal reset kursi');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Reset Kursi
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Kursi?</AlertDialogTitle>
          <AlertDialogDescription>
            Semua kursi di <strong>{gerbongName}</strong> akan dihapus.
            <br /><br />
            ⚠️ <strong>Peringatan:</strong> Reset akan gagal jika ada kursi yang sudah di-booking.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Ya, Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}