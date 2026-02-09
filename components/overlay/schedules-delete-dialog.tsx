// components/schedules/schedule-delete-dialog.tsx
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
import { useDeleteSchedule } from '@/features/schedules/useDeleteSchedules';
import { Schedule } from '@/lib/types/schedules';
import { Loader2, AlertTriangle } from 'lucide-react';

interface ScheduleDeleteDialogProps {
  schedule: Schedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ScheduleDeleteDialog({
  schedule,
  open,
  onOpenChange,
  onSuccess,
}: ScheduleDeleteDialogProps) {
  const { deleteSchedule, loading } = useDeleteSchedule();

  const handleDelete = async () => {
    if (!schedule) return;

    const success = await deleteSchedule(schedule.id);

    if (success) {
      onOpenChange(false);
      onSuccess();
    }
  };

  if (!schedule) return null;

  const hasBookings = schedule.kursi_terjual > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Jadwal?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus jadwal{' '}
            <span className="font-semibold">{schedule.kode_jadwal}</span>
            <br />
            Rute: {schedule.asal_keberangkatan} → {schedule.tujuan_keberangkatan}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {hasBookings && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Peringatan!</strong> Jadwal ini memiliki {schedule.kursi_terjual}{' '}
              kursi yang sudah terjual. Penghapusan jadwal akan mempengaruhi penumpang
              yang sudah memesan.
            </AlertDescription>
          </Alert>
        )}

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
              'Hapus Jadwal'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}