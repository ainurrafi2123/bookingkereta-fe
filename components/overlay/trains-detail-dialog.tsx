// components/trains/train-detail-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrainDetail } from "@/features/trains/useTrainsDetail";

interface TrainDetailDialogProps {
  trainId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrainDetailDialog({
  trainId,
  open,
  onOpenChange,
}: TrainDetailDialogProps) {
  const { train, loading, error } = useTrainDetail(trainId);

  const getKelasVariant = (kelas: string) => {
    switch (kelas.toLowerCase()) {
      case "eksekutif":
        return "default";
      case "bisnis":
        return "secondary";
      case "ekonomi":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Kereta</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : train ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Informasi Kereta</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <dt className="text-muted-foreground">Kode Kereta:</dt>
                <dd className="font-mono font-medium">{train.kode_kereta}</dd>

                <dt className="text-muted-foreground">Nama Kereta:</dt>
                <dd className="font-medium">{train.nama_kereta}</dd>

                <dt className="text-muted-foreground">Kelas:</dt>
                <dd>
                  <Badge variant={getKelasVariant(train.kelas_kereta)}>
                    {train.kelas_kereta.charAt(0).toUpperCase() +
                      train.kelas_kereta.slice(1)}
                  </Badge>
                </dd>

                <dt className="text-muted-foreground">Deskripsi:</dt>
                <dd className="col-span-2 text-muted-foreground">
                  {train.deskripsi || "Tidak ada deskripsi"}
                </dd>

                {train.created_at && (
                  <>
                    <dt className="text-muted-foreground">Dibuat pada:</dt>
                    <dd>
                      {new Date(train.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </dd>
                  </>
                )}

                {train.updated_at && (
                  <>
                    <dt className="text-muted-foreground">
                      Terakhir diupdate:
                    </dt>
                    <dd>
                      {new Date(train.updated_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
