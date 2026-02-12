"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, User, CheckCircle2 } from "lucide-react";
import { SeatSelectionDialog } from "@/components/booking/seat-selection-dialog";
import { BookingSummary } from "@/components/booking/booking-summary";
import { PassengerForm } from "@/components/booking/passenger-form";
import { BookingHeader } from "@/components/booking/booking-header";
import { apiFetch } from "@/lib/fetcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useScheduleDetail } from "@/features/booking/useScheduleDetail";
import { useCreateBooking } from "@/features/booking/useCreateBooking";
import type { Passenger } from "@/lib/types/booking";
import type { Route } from "next";
import Link from "next/link";
import { getBookingReceiptByCode, type BookingReceipt } from "@/lib/api/booking";

export default function BookingPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const scheduleId = Number(id);
  const adults = Number(searchParams.get("adults") || "1");
  const elderly = Number(searchParams.get("elderly") || "0");
  const youth = Number(searchParams.get("youth") || "0");

  // Fetch schedule details
  const { schedule, isLoading: scheduleLoading, error: scheduleError } = useScheduleDetail(scheduleId);

  // Booking submission
  const { submit, isLoading: submitting, error: submitError } = useCreateBooking();

  // Get current user
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [penumpangId, setPenumpangId] = useState<number | null>(null);
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);

  useEffect(() => {
    // 1. Try to get from localStorage first for immediate UI
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        // Fallback checks
        if (user.penumpang?.id) {
            setPenumpangId(user.penumpang.id);
        }
      } catch (err) {
        console.error("Failed to parse user", err);
      }
    }

    // 2. Fetch fresh profile from API to ensure we have a valid penumpangId
    const fetchProfile = async () => {
        try {
            // /users/me returns { role: 'penumpang', data: { id: 1, ... } }
            const response = await apiFetch<any>('/users/me');
            console.log("Profile fetched:", response);
            
            if (response.role === 'penumpang' && response.data?.id) {
                setPenumpangId(response.data.id);
                // Optionally update currentUser if needed, but for now ID is critical
            } else if (response.role === 'petugas') {
                 // Handle petugas if necessary, or alert they can't book as normal user? 
                 console.warn("Logged in as petugas, might not have passenger ID for self-booking");
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    fetchProfile();
  }, []);

  // Initialize passengers based on URL params
  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    const list: Passenger[] = [];
    for (let i = 0; i < adults; i++) {
      list.push({ nik: "", nama: "", kategori: "dewasa", id_kursi: null });
    }
    for (let i = 0; i < elderly; i++) {
      list.push({ nik: "", nama: "", kategori: "lansia", id_kursi: null });
    }
    for (let i = 0; i < youth; i++) {
      list.push({ nik: "", nama: "", kategori: "anak", id_kursi: null });
    }
    return list;
  });

  const [seatDialogOpen, setSeatDialogOpen] = useState(false);

  const updatePassenger = (
    index: number,
    field: keyof Passenger,
    value: any
  ) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSeatSelected = (seats: { id: number; no: string }[]) => {
    seats.forEach((seat, idx) => {
      if (idx < passengers.length) {
        updatePassenger(idx, "id_kursi", seat.id);
        updatePassenger(idx, "no_kursi", seat.no);
      }
    });
  };

  // Validation
  const canSubmit =
    passengers.every(
      (p) =>
        p.nik.length === 16 &&
        p.nama.trim().length >= 3 &&
        p.id_kursi !== null
    ) &&
    passengers.length === adults + elderly + youth &&
    penumpangId !== null;

  const handleSubmit = async () => {
    if (!canSubmit || !penumpangId) {
      console.warn("Submit blocked: canSubmit is false or penumpangId is null", { canSubmit, penumpangId });
      return;
    }

    try {
      const payload = {
        id_penumpang: penumpangId,
        id_jadwal_kereta: scheduleId,
        metode_pembayaran: "ATM", // Default payment method
        penumpang: passengers.map((p) => ({
          nik: p.nik,
          nama: p.nama,
          kategori: p.kategori,
          id_kursi: p.id_kursi!,
        })),
      };

      console.log("Sending booking data:", payload);
      const response = await submit(payload);
      console.log("Booking response success:", response);
      
      // Fetch receipt
      console.log("Fetching receipt for kode_tiket:", response.data.kode_tiket);
      const receiptData = await getBookingReceiptByCode(response.data.kode_tiket);
      console.log("Receipt data received:", receiptData);
      setReceipt(receiptData);
    } catch (err: any) {
      console.error("Booking submission failed with error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
    }
  };

  // Loading state
  if (scheduleLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <BookingHeader currentStep={1} />
        <div className="flex items-center justify-center h-[calc(100vh-112px)]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Error state
  if (scheduleError || !schedule) {
    return (
      <div className="min-h-screen bg-slate-50">
        <BookingHeader currentStep={1} />
        <div className="flex items-center justify-center p-4 h-[calc(100vh-112px)]">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {scheduleError || "Jadwal tidak ditemukan"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const passengerCounts = {
    dewasa: adults,
    lansia: elderly,
    anak: youth,
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      <BookingHeader currentStep={1} />
      
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={"/dashboard" as Route}>Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={"/search" as Route}>Kereta Api</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Isi Data</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Forms (scrollable) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detail Pemesan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Detail Pemesan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentUser ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nama</p>
                        <p className="font-medium">
                          {currentUser.username || currentUser.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{currentUser.email}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Data pemesan diambil dari akun Anda
                    </p>
                  </>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Silakan login untuk melanjutkan pemesanan
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Detail Penumpang */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Penumpang</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total: {adults + elderly + youth} orang
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {passengers.map((p, idx) => (
                  <PassengerForm
                    key={idx}
                    passenger={p}
                    index={idx}
                    onUpdate={(field, value) => updatePassenger(idx, field, value)}
                  />
                ))}

                {/* Seat Selection Button */}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSeatDialogOpen(true)}
                  >
                    Pilih / Ubah Kursi (
                    {passengers.filter((p) => p.id_kursi).length} dipilih)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submit Error */}
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Spacer for mobile */}
            <div className="h-24 lg:hidden" />
          </div>

          {/* Right: Summary (sticky) */}
          <div className="lg:sticky lg:top-6 h-fit space-y-4">
            <BookingSummary
              schedule={schedule}
              passengerCounts={passengerCounts}
            />

            <Button
              className="w-full"
              size="lg"
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Lakukan Pembayaran"
              )}
            </Button>

            {!canSubmit && (
              <p className="text-xs text-center text-muted-foreground">
                Lengkapi semua data dan pilih kursi untuk melanjutkan
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Seat Selection Dialog */}
      <SeatSelectionDialog
        open={seatDialogOpen}
        onOpenChange={setSeatDialogOpen}
        scheduleId={scheduleId}
        requiredCount={passengers.length}
        onConfirm={handleSeatSelected}
        preSelectedSeatIds={passengers
          .map((p) => p.id_kursi)
          .filter((id): id is number => id !== null)}
      />

      {/* Receipt Modal */}
      <Dialog open={!!receipt} onOpenChange={(open) => !open && setReceipt(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              Pembayaran Berhasil!
            </DialogTitle>
            {receipt && (
              <p className="text-center text-sm text-muted-foreground">
                Kode Pemesanan: <span className="font-mono font-bold text-slate-900">{receipt.kode_pemesanan_display}</span>
              </p>
            )}
          </DialogHeader>

          {receipt && (
            <div className="space-y-6 text-sm">
              {/* Company Info */}
              <div className="text-center space-y-1 border-b pb-4">
                <h3 className="font-bold uppercase tracking-wider text-slate-700">{receipt.perusahaan.nama}</h3>
                <p className="text-xs text-muted-foreground">{receipt.perusahaan.npwp}</p>
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Kereta</p>
                  <p className="font-medium">{receipt.rincian.kereta}</p>
                  <p className="text-xs">{receipt.rincian.kelas}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs">Tanggal</p>
                  <p className="font-medium">{receipt.detail_pemesanan[0].keberangkatan.split('|')[1].trim()}</p>
                </div>
              </div>

              {/* Passengers */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <p className="font-semibold text-xs uppercase text-muted-foreground mb-2">Penumpang</p>
                {receipt.rincian.penumpang.map((p, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{p.nama}</span>
                    <span className="font-medium">{p.harga}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-end pt-2 border-t">
                <span className="font-bold text-lg">Total Pembayaran</span>
                <span className="font-bold text-xl text-blue-600">{receipt.total_pembayaran}</span>
              </div>

              <p className="text-[10px] text-center text-muted-foreground">
                {receipt.ppn_info} {receipt.ppn_disclaimer}
              </p>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => router.push('/' as Route)}
                >
                  Kembali ke Halaman Utama
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => router.push('/history' as Route)}
                >
                  Lihat Riwayat Pesanan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}