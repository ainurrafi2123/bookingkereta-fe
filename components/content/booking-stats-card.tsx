"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingStatistics } from "@/lib/types/manage-booking";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface BookingStatsCardsProps {
  statistics: BookingStatistics | null;
  loading: boolean;
}

export function BookingStatsCards({
  statistics,
  loading,
}: BookingStatsCardsProps) {
  const formatCurrency = (value: string | number | null | undefined) => {
    // Jika null/undefined/kosong → return Rp0
    if (value == null || value === "") return "Rp0";

    // Ubah ke string dulu
    let strValue = String(value).trim();

    // Hapus prefix "Rp", "Rp.", spasi, dll
    strValue = strValue.replace(/^Rp\.?\s*/i, "");

    // Hapus semua titik (pemisah ribuan di ID) dan ganti koma jadi titik (untuk desimal)
    strValue = strValue.replace(/\./g, "").replace(/,/g, ".");

    // Parse ke number
    const num = Number(strValue);

    // Jika NaN, return Rp0
    if (isNaN(num)) return "Rp0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (loading) {
    return (
      <div
        className={`
          grid gap-4 md:grid-cols-2 lg:grid-cols-4
          *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card
          dark:*:data-[slot=card]:bg-card
          *:data-[slot=card]:bg-linear-to-t
          *:data-[slot=card]:shadow-xs
        `}
      >
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card" data-slot="card">
            <CardHeader>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-1">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!statistics) return null;

  return (
    <div
      className={`
        grid gap-4 md:grid-cols-2 lg:grid-cols-4
        *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card
        dark:*:data-[slot=card]:bg-card
        *:data-[slot=card]:bg-linear-to-t
        *:data-[slot=card]:shadow-xs
      `}
    >
      {/* Total Pemesanan */}
      <Card className="@container/card" data-slot="card">
        <CardHeader>
          <CardDescription>Total Pemesanan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {statistics.total_transaksi}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="size-3.5" />
              +12%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
            Semua transaksi{" "}
            <ShoppingCart className="size-4 text-muted-foreground" />
          </div>
          <div className="text-muted-foreground">Termasuk semua status</div>
        </CardFooter>
      </Card>

      {/* Total Pendapatan */}
      <Card className="@container/card" data-slot="card">
        <CardHeader>
          <CardDescription>Total Pendapatan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(statistics.total_pendapatan) }
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="size-3.5" />
              +18.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
            Penjualan meningkat{" "}
            <DollarSign className="size-4 text-muted-foreground" />
          </div>
          <div className="text-muted-foreground">
            Total revenue semua booking
          </div>
        </CardFooter>
      </Card>

      {/* Booking Aktif */}
      <Card className="@container/card" data-slot="card">
        <CardHeader>
          <CardDescription>Booking Aktif</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-blue-600 @[250px]/card:text-3xl">
            {statistics.booking_aktif}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="gap-1 border-blue-500 text-blue-600"
            >
              <TrendingUp className="size-3.5" />
              +5.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium text-blue-600">
            Terkonfirmasi aktif <CheckCircle className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Menunggu pelaksanaan event
          </div>
        </CardFooter>
      </Card>

      {/* Dibatalkan */}
      <Card className="@container/card" data-slot="card">
        <CardHeader>
          <CardDescription>Dibatalkan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-destructive @[250px]/card:text-3xl">
            {statistics.booking_dibatalkan}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="gap-1 border-destructive text-destructive"
            >
              <TrendingDown className="size-3.5" />
              -3.8%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-1.5 font-medium text-destructive">
            Transaksi batal <XCircle className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Dibatalkan oleh user / sistem
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
