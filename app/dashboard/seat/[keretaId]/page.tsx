// app/dashboard/kursi/[keretaId]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { JadwalFilter } from '@/components/content/jadwal-filter';
import { useGerbongByTrain } from "@/features/seats/useGerbongByTrain";
import { GerbongCard } from "@/components/content/GerbongCard";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Info } from 'lucide-react';

export default function GerbongListPage() {
  const params = useParams();
  const router = useRouter();
  const keretaId = params.keretaId as string;

  // ⭐ State untuk filter jadwal
  const [selectedJadwalId, setSelectedJadwalId] = useState<string | null>(null);

  // ⭐ Fetch gerbong dengan optional jadwal filter
  const { gerbongs, loading, error, refetch } = useGerbongByTrain(keretaId, selectedJadwalId);

  const handleJadwalChange = (jadwalId: string | null) => {
    setSelectedJadwalId(jadwalId);
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pilih Gerbong</h1>
          <p className="text-muted-foreground">Kereta ID: {keretaId}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      {/* ⭐ Filter Jadwal */}
      <JadwalFilter 
        keretaId={keretaId}
        onJadwalChange={handleJadwalChange}
        selectedJadwalId={selectedJadwalId}
      />

      {/* ⭐ Info Alert */}
      {!selectedJadwalId && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Menampilkan semua gerbong. Pilih jadwal untuk melihat ketersediaan kursi spesifik.
          </AlertDescription>
        </Alert>
      )}

      {selectedJadwalId && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Menampilkan ketersediaan kursi untuk <strong>Jadwal ID: {selectedJadwalId}</strong>
          </AlertDescription>
        </Alert>
      )}

      {/* Gerbong Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))
        ) : gerbongs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Tidak ada gerbong untuk kereta ini</p>
          </div>
        ) : (
          gerbongs.map((gerbong) => (
            <GerbongCard 
              key={gerbong.id} 
              {...gerbong} 
              keretaId={Number(keretaId)}
              selectedJadwalId={selectedJadwalId} // ⭐ Pass jadwal ke card
              onGenerated={refetch}
            />
          ))
        )}
      </div>
    </div>
  );
}