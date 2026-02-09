// components/carriages/carriage-delete-dialog.tsx
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
import { useDeleteCarriage } from '@/features/carriages/useDeleteCarriages';
import { Carriage } from '@/lib/types/carriages';
import { Loader2 } from 'lucide-react';

interface CarriageDeleteDialogProps {
  carriage: Carriage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CarriageDeleteDialog({
  carriage,
  open,
  onOpenChange,
  onSuccess,
}: CarriageDeleteDialogProps) {
  const { deleteCarriage, loading } = useDeleteCarriage();

  const handleDelete = async () => {
    if (!carriage) return;

    const success = await deleteCarriage(carriage.id);

    if (success) {
      onOpenChange(false);
      onSuccess();
    }
  };

  if (!carriage) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Gerbong?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus gerbong{' '}
            <span className="font-semibold">{carriage.nama_gerbong}</span>
            {carriage.kereta && (
              <>
                {' '}
                dari kereta{' '}
                <span className="font-semibold">{carriage.kereta.nama_kereta}</span>
              </>
            )}
            ?
            <br />
            <span className="text-destructive font-medium">
              Tindakan ini tidak dapat dibatalkan.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Hapus'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}