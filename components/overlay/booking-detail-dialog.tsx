// components/bookings/booking-detail-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookingDetail } from '@/features/booking/useManageDetail';
import {
  Calendar,
  Train,
  Users,
  CreditCard,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface BookingDetailDialogProps {
  bookingId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailDialog({
  bookingId,
  open,
  onOpenChange,
}: BookingDetailDialogProps) {
  const { booking, loading, error } = useBookingDetail(bookingId);

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      booked: 'default',
      confirmed: 'default', // fallback
      cancelled: 'destructive',
      completed: 'secondary',
    };
    return variants[status] || 'outline';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      pending: AlertCircle,
      booked: CheckCircle2,
      confirmed: CheckCircle2, // fallback
      cancelled: XCircle,
      completed: CheckCircle2,
    };
    const Icon = icons[status] || AlertCircle;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu Pembayaran',
      booked: 'Terkonfirmasi',
      confirmed: 'Terkonfirmasi', // fallback
      cancelled: 'Dibatalkan',
      completed: 'Selesai',
    };
    return labels[status] || status;
  };

  const formatCurrency = (amount: any) => {
    if (typeof amount === 'string') {
      return amount.startsWith('Rp') ? amount : `Rp ${amount}`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "EEEE, dd MMMM yyyy 'pukul' HH:mm", {
      locale: id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pemesanan</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : booking ? (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kode Tiket</p>
                <p className="font-mono font-bold text-lg">{booking.kode_tiket}</p>
              </div>
              <Badge variant={getStatusVariant(booking.status)} className="gap-1">
                {getStatusIcon(booking.status)}
                {getStatusLabel(booking.status)}
              </Badge>
            </div>

            <Separator />

            {/* Jadwal Info */}
            {booking.jadwal && (
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Train className="h-4 w-4" />
                  Informasi Perjalanan
                </h3>

                {/* Kereta */}
                <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">
                    {booking.jadwal.kereta}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Kode: {booking.jadwal.kode} • Kelas:{' '}
                    {booking.jadwal.kelas}
                  </p>
                </div>

                {/* Route */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">
                        {booking.jadwal.asal}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.jadwal.tanggal_berangkat}
                    </p>
                  </div>

                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />

                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <p className="font-semibold">
                        {booking.jadwal.tujuan}
                      </p>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.jadwal.tanggal_tiba}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Penumpang */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Daftar Penumpang
              </h3>
              {booking.penumpang && booking.penumpang.length > 0 ? (
                <div className="space-y-2">
                  {booking.penumpang.map((detail: any, index: number) => (
                    <div
                      key={detail.id_detail}
                      className="p-3 border rounded-lg bg-muted/20"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {detail.nama || `Penumpang ${index + 1}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            NIK: {detail.nik || '-'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            Kursi {detail.kursi || '-'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Gerbong {detail.gerbong || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Tidak ada data penumpang
                </p>
              )}
            </div>

            <Separator />

            {/* Pembayaran */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Informasi Pembayaran
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Metode Pembayaran:</span>
                  <span className="font-medium">{booking.metode_pembayaran}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Pembayaran:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {formatCurrency(booking.total_harga)}
                  </span>
                </div>
                {booking.status === 'pending' && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Menunggu pembayaran. Silakan selesaikan pembayaran sebelum{' '}
                    {format(new Date(booking.created_at), 'dd MMM yyyy HH:mm', {
                      locale: id,
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            {(booking.created_at || booking.updated_at) && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Riwayat</h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {booking.created_at && (
                      <>
                        <dt className="text-muted-foreground">Dibuat pada:</dt>
                        <dd>
                          {format(new Date(booking.created_at), 'dd MMM yyyy HH:mm', {
                            locale: id,
                          })}
                        </dd>
                      </>
                    )}

                    {booking.updated_at && (
                      <>
                        <dt className="text-muted-foreground">Terakhir diupdate:</dt>
                        <dd>
                          {format(new Date(booking.updated_at), 'dd MMM yyyy HH:mm', {
                            locale: id,
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