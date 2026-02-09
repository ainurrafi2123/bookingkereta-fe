"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSeatMap } from "@/features/seats/useSeatMap";
import { SeatGrid } from "@/components/layout/SeatGrid";
import { GenerateSeatButton } from "@/components/content/GenerateSeatButton";
import { ResetSeatButton } from "@/components/content/ResetSeatButton";
import { JadwalFilter } from "@/components/content/jadwal-filter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, RefreshCw, Info } from "lucide-react";
export default function SeatMapPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const keretaId = params.keretaId as string;
  const gerbongId = params.gerbongId as string;

  // ⭐ Auto-load jadwal dari query param

  const jadwalIdFromQuery = searchParams.get("jadwal_id");
  const [selectedJadwalId, setSelectedJadwalId] = useState<string | null>(
    jadwalIdFromQuery,
  );

  useEffect(() => {
    setSelectedJadwalId(jadwalIdFromQuery);
  }, [jadwalIdFromQuery]);

  const { seatMap, loading, error, refetch } = useSeatMap(
    gerbongId,
    selectedJadwalId,
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleJadwalChange = (jadwalId: string | null) => {
    setSelectedJadwalId(jadwalId);
  };

  if (error) {
    // Kemungkinan kursi belum di-generate
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Kursi Belum Tersedia</CardTitle>
            <CardDescription>
              Gerbong ini belum memiliki kursi. Generate terlebih dahulu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GenerateSeatButton
              gerbongId={Number(gerbongId)}
              gerbongName="Gerbong ini"
              onSuccess={handleRefresh}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-96" />
      </div>
    );
  }

  const available =
    seatMap?.kursi_available ??
    (seatMap?.seat_map
      ? Object.values(seatMap.seat_map)
          .flat()
          .filter((s) => s.status === "available").length
      : 0);
  const booked =
    seatMap?.kursi_booked ??
    (seatMap?.total_kursi ? seatMap.total_kursi - available : 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎫 {seatMap?.gerbong}</h1>
          <p className="text-muted-foreground">
            <Badge>{seatMap?.kelas}</Badge>
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      {/* Filter Jadwal */}
      <JadwalFilter
        keretaId={keretaId}
        onJadwalChange={handleJadwalChange}
        selectedJadwalId={selectedJadwalId}
      />

      {/* Info Alert */}
      {!selectedJadwalId && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Menampilkan master data kursi. Pilih jadwal untuk melihat status
            booking spesifik.
          </AlertDescription>
        </Alert>
      )}

      {selectedJadwalId && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Menampilkan status kursi untuk{" "}
            <strong>Jadwal ID: {selectedJadwalId}</strong>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Seat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{seatMap?.total_kursi}</p>
          </CardContent>
        </Card>

        {selectedJadwalId ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tersedia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{available}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Terbooked</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">{booked}</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pilih jadwal untuk melihat statistik booking
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Seat Map */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Seat Map</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <ResetSeatButton
                gerbongId={Number(gerbongId)}
                gerbongName={seatMap?.gerbong ?? ""}
                onSuccess={handleRefresh}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Badge variant="default">1A</Badge>
              <span className="text-sm">Tersedia</span>
            </div>
            {selectedJadwalId && (
              <div className="flex items-center gap-2">
                <Badge variant="destructive">2B</Badge>
                <span className="text-sm">Terbooked</span>
              </div>
            )}
            {!selectedJadwalId && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">2B</Badge>
                <span className="text-sm">Master Data</span>
              </div>
            )}
          </div>

          {/* Grid */}
          {seatMap && (
            <SeatGrid
              seatMap={seatMap.seat_map}
              kelas={seatMap.kelas}
              showStatus={!!selectedJadwalId} // ⭐ Tampilkan warna jika ada filter jadwal
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}


