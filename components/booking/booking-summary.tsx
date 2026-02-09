// components/booking/booking-summary.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Train, MapPin, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { ScheduleDetail } from "@/lib/types/booking";

interface BookingSummaryProps {
  schedule: ScheduleDetail;
  passengerCounts: {
    dewasa: number;
    lansia: number;
    anak: number;
  };
}

export function BookingSummary({
  schedule,
  passengerCounts,
}: BookingSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: id });
  };

  // Calculate total price
  const totalDewasa = passengerCounts.dewasa * schedule.harga_dewasa;
  const totalLansia = passengerCounts.lansia * schedule.harga_lansia;
  const totalAnak = passengerCounts.anak * schedule.harga_anak;
  const grandTotal = totalDewasa + totalLansia + totalAnak;

  const totalPassengers =
    passengerCounts.dewasa + passengerCounts.lansia + passengerCounts.anak;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ringkasan Pemesanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Train Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">
              {schedule.kereta?.nama_kereta || "Kereta"}
            </span>
          </div>
          {schedule.kereta?.kelas_kereta && (
            <Badge variant="secondary">
              {schedule.kereta.kelas_kereta.charAt(0).toUpperCase() +
                schedule.kereta.kelas_kereta.slice(1)}
            </Badge>
          )}
          <p className="text-sm text-muted-foreground">
            {schedule.kode_jadwal}
          </p>
        </div>

        <Separator />

        {/* Route Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{schedule.asal_keberangkatan}</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(schedule.tanggal_berangkat)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-6">
            <div className="h-8 w-px bg-border" />
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{schedule.tujuan_keberangkatan}</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(schedule.tanggal_kedatangan)}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Passenger Count */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {totalPassengers} Penumpang
            </span>
          </div>
          <div className="space-y-1 text-sm pl-6">
            {passengerCounts.dewasa > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Dewasa × {passengerCounts.dewasa}
                </span>
                <span>{formatCurrency(totalDewasa)}</span>
              </div>
            )}
            {passengerCounts.lansia > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Lansia × {passengerCounts.lansia}
                </span>
                <span>{formatCurrency(totalLansia)}</span>
              </div>
            )}
            {passengerCounts.anak > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Anak × {passengerCounts.anak}
                </span>
                <span>{formatCurrency(totalAnak)}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Total Price */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Pembayaran</span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(grandTotal)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Harga sudah termasuk semua biaya
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
