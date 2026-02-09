// components/schedules/schedule-detail-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useScheduleDetail } from '@/features/schedules/useSchedulesDetail';
import {
  Calendar,
  Train,
  MapPin,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import { ScheduleStatus } from '@/lib/types/schedules';

interface ScheduleDetailDialogProps {
  scheduleId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDetailDialog({
  scheduleId,
  open,
  onOpenChange,
}: ScheduleDetailDialogProps) {
  const { schedule, loading, error } = useScheduleDetail(scheduleId);

  const getStatusVariant = (status: ScheduleStatus) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
      maintenance: 'outline',
    };
    return variants[status] as 'default' | 'secondary' | 'destructive' | 'outline';
  };

  const getStatusLabel = (status: ScheduleStatus) => {
    const labels = {
      active: 'Aktif',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
      maintenance: 'Maintenance',
    };
    return labels[status];
  };

  const getStatusIcon = (status: ScheduleStatus) => {
    const icons = {
      active: CheckCircle2,
      completed: CheckCircle2,
      cancelled: XCircle,
      maintenance: Wrench,
    };
    const Icon = icons[status];
    return <Icon className="h-4 w-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateProgress = (terjual: number, total: number) => {
    return total > 0 ? (terjual / total) * 100 : 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Jadwal Kereta</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : schedule ? (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kode Jadwal</p>
                <p className="font-mono font-bold text-lg">{schedule.kode_jadwal}</p>
              </div>
              <Badge variant={getStatusVariant(schedule.status)} className="gap-1">
                {getStatusIcon(schedule.status)}
                {getStatusLabel(schedule.status)}
              </Badge>
            </div>

            <Separator />

            {/* Rute Perjalanan */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Rute Perjalanan
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 rounded-lg border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Keberangkatan</p>
                  <p className="font-semibold text-lg">{schedule.asal_keberangkatan}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {formatDate(schedule.tanggal_berangkat)}
                  </p>
                </div>
                
                <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />
                
                <div className="flex-1 rounded-lg border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Tujuan</p>
                  <p className="font-semibold text-lg">{schedule.tujuan_keberangkatan}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {formatDate(schedule.tanggal_kedatangan)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Informasi Kereta */}
            {schedule.kereta && (
              <>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Train className="h-4 w-4" />
                    Informasi Kereta
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <dt className="text-muted-foreground">Nama Kereta:</dt>
                    <dd className="font-medium">{schedule.kereta.nama_kereta}</dd>

                    <dt className="text-muted-foreground">Kode Kereta:</dt>
                    <dd className="font-mono font-medium">{schedule.kereta.kode_kereta}</dd>

                    <dt className="text-muted-foreground">Kelas:</dt>
                    <dd className="font-medium capitalize">{schedule.kereta.kelas_kereta}</dd>
                  </dl>
                </div>
                <Separator />
              </>
            )}

            {/* Ketersediaan Kursi */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Ketersediaan Kursi
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3 bg-primary/5">
                    <p className="text-xs text-muted-foreground mb-1">Total Kursi</p>
                    <p className="text-2xl font-bold">{schedule.kuota_total}</p>
                  </div>
                  <div className="rounded-lg border p-3 bg-green-500/5">
                    <p className="text-xs text-muted-foreground mb-1">Tersedia</p>
                    <p className="text-2xl font-bold text-green-600">
                      {schedule.kursi_tersedia}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 bg-red-500/5">
                    <p className="text-xs text-muted-foreground mb-1">Terjual</p>
                    <p className="text-2xl font-bold text-red-600">
                      {schedule.kursi_terjual}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Persentase Terjual</span>
                    <span className="font-medium">
                      {Math.round(
                        calculateProgress(schedule.kursi_terjual, schedule.kuota_total)
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={calculateProgress(schedule.kursi_terjual, schedule.kuota_total)}
                    className="h-3"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Harga Tiket */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Harga Tiket
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Dewasa</p>
                  <p className="font-bold text-lg">
                    {formatCurrency(schedule.harga_dewasa)}
                  </p>
                </div>
                <div className="rounded-lg border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Anak-anak</p>
                  <p className="font-bold text-lg">
                    {formatCurrency(schedule.harga_anak)}
                  </p>
                </div>
                <div className="rounded-lg border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Lansia</p>
                  <p className="font-bold text-lg">
                    {formatCurrency(schedule.harga_lansia)}
                  </p>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            {(schedule.created_at || schedule.updated_at) && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Riwayat
                  </h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {schedule.created_at && (
                      <>
                        <dt className="text-muted-foreground">Dibuat pada:</dt>
                        <dd className="text-sm">
                          {new Date(schedule.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </dd>
                      </>
                    )}

                    {schedule.updated_at && (
                      <>
                        <dt className="text-muted-foreground">Terakhir diupdate:</dt>
                        <dd className="text-sm">
                          {new Date(schedule.updated_at).toLocaleDateString('id-ID', {
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
              </>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}