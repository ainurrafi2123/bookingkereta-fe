// components/trains/train-delete-dialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTrain } from "@/features/trains/useDeleteTrains";
import { Train } from "@/lib/types/trains";
import { Loader2 } from "lucide-react";

interface TrainDeleteDialogProps {
  train: Train | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function TrainDeleteDialog({
  train,
  open,
  onOpenChange,
  onSuccess,
}: TrainDeleteDialogProps) {
  const { deleteTrain, loading } = useDeleteTrain();

  const handleDelete = async () => {
    if (!train) return;

    const success = await deleteTrain(train.id);

    if (success) {
      onOpenChange(false);
      onSuccess();
    }
  };

  if (!train) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kereta?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus kereta{" "}
            <span className="font-semibold">
              {train.nama_kereta} ({train.kode_kereta})
            </span>
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
              "Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
