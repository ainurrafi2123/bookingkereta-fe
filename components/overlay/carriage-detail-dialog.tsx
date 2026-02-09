// components/carriages/carriage-detail-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCarriageDetail } from '@/features/carriages/useCarriageDetail';
import { Users, Train } from 'lucide-react';

interface CarriageDetailDialogProps {
  carriageId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CarriageDetailDialog({
  carriageId,
  open,
  onOpenChange,
}: CarriageDetailDialogProps) {
  const { carriage, loading, error } = useCarriageDetail(carriageId);

  const getKelasVariant = (kelas: string) => {
    switch (kelas.toLowerCase()) {
      case 'eksekutif':
        return 'default';
      case 'bisnis':
        return 'secondary';
      case 'ekonomi':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Gerbong</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : carriage ? (
          <div className="space-y-6">
            {/* Informasi Gerbong */}
            <div>
              <h3 className="font-semibold mb-3">Informasi Gerbong</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <dt className="text-muted-foreground">Nama Gerbong:</dt>
                <dd className="font-medium">{carriage.nama_gerbong}</dd>

                <dt className="text-muted-foreground">Kelas:</dt>
                <dd>
                  <Badge variant={getKelasVariant(carriage.kelas_gerbong)}>
                    {carriage.kelas_gerbong.charAt(0).toUpperCase() +
                      carriage.kelas_gerbong.slice(1)}
                  </Badge>
                </dd>

                <dt className="text-muted-foreground">Kuota Penumpang:</dt>
                <dd className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{carriage.kuota} orang</span>
                </dd>
              </dl>
            </div>

            {/* Informasi Kereta */}
            {carriage.kereta && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Train className="h-4 w-4" />
                  Informasi Kereta
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <dt className="text-muted-foreground">Kode Kereta:</dt>
                  <dd className="font-mono font-medium">
                    {carriage.kereta.kode_kereta}
                  </dd>

                  <dt className="text-muted-foreground">Nama Kereta:</dt>
                  <dd className="font-medium">{carriage.kereta.nama_kereta}</dd>

                  <dt className="text-muted-foreground">Kelas Kereta:</dt>
                  <dd>
                    <Badge variant={getKelasVariant(carriage.kereta.kelas_kereta)}>
                      {carriage.kereta.kelas_kereta.charAt(0).toUpperCase() +
                        carriage.kereta.kelas_kereta.slice(1)}
                    </Badge>
                  </dd>
                </dl>
              </div>
            )}

            {/* Timestamp */}
            {(carriage.created_at || carriage.updated_at) && (
              <div>
                <h3 className="font-semibold mb-3">Riwayat</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {carriage.created_at && (
                    <>
                      <dt className="text-muted-foreground">Dibuat pada:</dt>
                      <dd>
                        {new Date(carriage.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </dd>
                    </>
                  )}

                  {carriage.updated_at && (
                    <>
                      <dt className="text-muted-foreground">Terakhir diupdate:</dt>
                      <dd>
                        {new Date(carriage.updated_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}