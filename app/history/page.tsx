"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Ticket, Calendar, Search, MapPin, Clock, Eye, Printer, X, RefreshCcw, Ban, MessageSquare, Headphones } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
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
import { useCancelBooking } from "@/features/booking/useCancelBooking";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileHeader } from "@/components/sections/profile-header";
import { BookingDetailDialog } from "@/components/overlay/booking-detail-dialog";
import { ReceiptDialog } from "@/components/overlay/receipt-dialog";
import { useProfile } from "@/features/profile/useProfile";
import { ProfileSkeleton } from "@/components/ui/profile-skeleton";


interface BookingHistoryItem {
  id: number;
  kode_tiket: string;
  tanggal_pembelian: string;
  status: string;
  total_harga: string;
  jadwal: {
    kereta: string;
    kelas: string;
    asal: string;
    tujuan: string;
    tanggal_berangkat: string;
    tanggal_tiba: string;
  };
  jumlah_penumpang: number;
}

export default function HistoryPage() {
  const { profile, loading: profileLoading } = useProfile();
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<string | undefined>(undefined);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [receiptBookingId, setReceiptBookingId] = useState<number | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const { cancelBooking, loading: cancelling } = useCancelBooking();

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return {
      value: format(d, 'yyyy-MM'),
      label: format(d, 'MMMM yyyy', { locale: id }),
    };
  });

  const filters = useMemo(() => ({
    tanggal: date ? format(date, 'yyyy-MM-dd') : undefined,
    bulan: month,
  }), [date, month]);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        // Build query params
        const params = new URLSearchParams();
        if (filters.tanggal) params.append('tanggal', filters.tanggal);
        if (filters.bulan) params.append('bulan', filters.bulan);
        
        const queryString = params.toString();
        const endpoint = `/pembelian-tiket${queryString ? `?${queryString}` : ''}`;
        
        const response = await apiFetch<{ data: { data: BookingHistoryItem[] } }>(endpoint);
        setBookings(response.data.data);
      } catch (err: any) {
        console.error("Failed to fetch history:", err);
        setError("Gagal memuat riwayat pesanan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [filters]);

  const clearFilters = () => {
    setDate(undefined);
    setMonth(undefined);
  };

  const refetch = useCallback(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.tanggal) params.append('tanggal', filters.tanggal);
        if (filters.bulan) params.append('bulan', filters.bulan);
        const queryString = params.toString();
        const endpoint = `/pembelian-tiket${queryString ? `?${queryString}` : ''}`;
        const response = await apiFetch<{ data: { data: BookingHistoryItem[] } }>(endpoint);
        setBookings(response.data.data);
      } catch (err: any) {
        console.error("Failed to fetch history:", err);
        setError("Gagal memuat riwayat pesanan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [filters]);

  const handleConfirmCancel = async () => {
    if (!cancelBookingId) return;
    const result = await cancelBooking(cancelBookingId);
    if (result) {
      toast.success('Pemesanan berhasil dibatalkan');
      refetch();
    } else {
      toast.error('Gagal membatalkan pemesanan');
    }
    setIsCancelOpen(false);
    setCancelBookingId(null);
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-green-100 text-green-700 hover:bg-green-100/80';
      case 'cancelled': return 'bg-red-100 text-red-700 hover:bg-red-100/80';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100/80';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'booked': return 'Terkonfirmasi';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  if (profileLoading) {
    return <ProfileSkeleton />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <ProfileHeader />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ProfileHeader />

      <main className="max-w-6xl container mx-auto px-4 py-8 md:py-12">
        

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-xl border shadow-sm">
              {/* Date Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    size="sm"
                    className={cn(
                      'w-[180px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, 'dd MMM yyyy', { locale: id }) : <span>Pilih Tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setMonth(undefined);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Month Filter */}
              <Select
                key={month ? month : 'month-reset'}
                value={month}
                onValueChange={(val) => {
                  setMonth(val);
                  setDate(undefined);
                }}
              >
                <SelectTrigger className="w-40 h-9">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(date || month) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2">
                  <X className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="h-9 ml-auto"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>

            {bookings.length === 0 ? (
              <Card className="text-center py-12 border-dashed">
                <CardContent>
                  <div className="bg-muted p-4 rounded-full w-fit mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Belum ada pesanan</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    {(date || month) 
                      ? "Tidak ada pesanan untuk filter yang dipilih."
                      : "Anda belum pernah melakukan pemesanan tiket kereta. Mulai perjalanan Anda sekarang!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className="border-b">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted p-2 rounded-md">
                            <Ticket className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">
                              {booking.jadwal.kereta}
                              <span className="text-sm font-normal text-muted-foreground ml-2">({booking.jadwal.kelas})</span>
                            </CardTitle>
                            <CardDescription className="text-xs font-mono mt-1">
                              #{booking.kode_tiket}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className={`w-fit ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 flex flex-col items-center">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                         <div className="w-px h-12 bg-border my-1" />
                                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                                    </div>
                                    <div className="space-y-8 flex-1">
                                         <div>
                                            <p className="text-sm font-medium">{booking.jadwal.asal}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <Calendar className="h-3 w-3" />
                                                {booking.jadwal.tanggal_berangkat}
                                            </div>
                                         </div>
                                         <div>
                                            <p className="text-sm font-medium">{booking.jadwal.tujuan}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <Clock className="h-3 w-3" />
                                                {booking.jadwal.tanggal_tiba}
                                            </div>
                                         </div>
                                    </div>
                                </div>
                            </div>

                             <div className="flex flex-col justify-between items-start md:items-end gap-4">
                                <div className="text-left md:text-right w-full">
                                    <p className="text-xs text-muted-foreground mb-1">Total Pembayaran</p>
                                    <p className="text-2xl font-bold">Rp {booking.total_harga}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {booking.jumlah_penumpang} Penumpang
                                    </p>
                                </div>
                             </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBookingId(booking.id);
                          setIsDetailOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Detail
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReceiptBookingId(booking.id);
                          setIsReceiptOpen(true);
                        }}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Cetak Tiket
                      </Button>
                      {booking.status === 'booked' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="ml-auto"
                          disabled={cancelling}
                          onClick={() => {
                            setCancelBookingId(booking.id);
                            setIsCancelOpen(true);
                          }}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Batalkan
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Butuh Bantuan?</CardTitle>
                  <CardDescription>
                    Punya kendala dengan pemesanan Anda? Tim Customer Service kami siap membantu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat Support
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Respon rata-rata dalam 5 menit
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informasi Penting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-medium">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Lakukan cetak ulang tiket mandiri di stasiun minimal 1 jam sebelum keberangkatan.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-medium">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Pembatalan tiket hanya dapat dilakukan via aplikasi maksimal 3 jam sebelum jadwal.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <BookingDetailDialog
        bookingId={selectedBookingId}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <ReceiptDialog
        bookingId={receiptBookingId}
        open={isReceiptOpen}
        onOpenChange={setIsReceiptOpen}
      />

      <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pemesanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin membatalkan pemesanan ini? Tindakan ini tidak dapat dibatalkan dan kursi akan dilepas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Kembali</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelling}
            >
              {cancelling ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Membatalkan...</>
              ) : (
                'Ya, Batalkan'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
