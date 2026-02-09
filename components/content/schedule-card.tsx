// components/search/schedule-card.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Schedule } from "@/lib/types/schedules";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Clock, ArrowRight, Users, Train } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

interface ScheduleCardProps {
  schedule: Schedule;
  passengerCounts?: {
    adults: number;
    elderly: number;
    youth: number;
  };
}

export function ScheduleCard({ schedule, passengerCounts }: ScheduleCardProps) {
  const router = useRouter();

  // Default passenger counts if not provided
  const counts = passengerCounts || { adults: 1, elderly: 0, youth: 0 };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm", { locale: id });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: id });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

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

  const calculateDuration = () => {
    const start = new Date(schedule.tanggal_berangkat);
    const end = new Date(schedule.tanggal_kedatangan);
    const diffMs = end.getTime() - start.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHrs}j ${diffMins}m`;
  };

  const seatAvailability = schedule.kursi_tersedia || 0;
  const isLowSeat = seatAvailability < 10;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Section - Train Info */}
          <div className="flex-1 space-y-3">
            {/* Train Name & Class */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Train className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">
                  {schedule.kereta?.nama_kereta || "Kereta"}
                </h3>
              </div>
              {schedule.kereta?.kelas_kereta && (
                <Badge variant={getKelasVariant(schedule.kereta.kelas_kereta)}>
                  {schedule.kereta.kelas_kereta.charAt(0).toUpperCase() +
                    schedule.kereta.kelas_kereta.slice(1)}
                </Badge>
              )}
            </div>

            {/* Route & Time */}
            <div className="flex items-center gap-4">
              {/* Departure */}
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {formatTime(schedule.tanggal_berangkat)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {schedule.asal_keberangkatan}
                </p>
              </div>

              {/* Duration */}
              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">{calculateDuration()}</span>
                </div>
                <div className="w-full h-px bg-linear-to-r from-transparent via-gray-300 to-transparent my-1" />
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>

              {/* Arrival */}
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {formatTime(schedule.tanggal_kedatangan)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {schedule.tujuan_keberangkatan}
                </p>
              </div>
            </div>

            {/* Date */}
            <p className="text-sm text-muted-foreground">
              {formatDate(schedule.tanggal_berangkat)}
            </p>
          </div>

          {/* Right Section - Price & Booking */}
          <div className="flex flex-col items-end justify-between gap-3 md:min-w-[200px]">
            {/* Seat Availability */}
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span
                className={
                  isLowSeat
                    ? "text-red-600 font-semibold"
                    : "text-muted-foreground"
                }
              >
                {seatAvailability} kursi tersisa
              </span>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Mulai dari</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(schedule.harga_dewasa)}
              </p>
              <p className="text-xs text-muted-foreground">per orang</p>
            </div>

            {/* Book Button */}
            <Button
              onClick={() => {
                const params = new URLSearchParams({
                  adults: counts.adults.toString(),
                  elderly: counts.elderly.toString(),
                  youth: counts.youth.toString(),
                });

                router.push(
                  `/booking/${schedule.id}?${params.toString()}` as Route,
                );
              }}
              disabled={seatAvailability === 0}
            >
              {seatAvailability === 0 ? "Penuh" : "Pilih"}
            </Button>
          </div>
        </div>

        {/* Low seat warning */}
        {isLowSeat && seatAvailability > 0 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            ⚠️ Kursi hampir habis! Segera pesan sebelum kehabisan.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
