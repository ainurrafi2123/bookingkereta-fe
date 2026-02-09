// features/seats/components/GerbongCard.tsx
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useGenerateSeats } from '@/features/seats/useGenerateSeats';
import Link from 'next/link';
import type { Route } from 'next';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface GerbongCardProps {
  id: number;
  keretaId: number;
  nama_gerbong: string;
  kelas_gerbong: string;
  kuota: number;
  kursi_count: number;
  available_count?: number;
  booked_count?: number;
  jadwal_id?: number;
  selectedJadwalId?: string | null; // ⭐ NEW
  onGenerated?: () => void;
}

export function GerbongCard({ 
  id, 
  keretaId, 
  nama_gerbong, 
  kelas_gerbong, 
  kuota, 
  kursi_count,
  available_count,
  booked_count,
  jadwal_id,
  selectedJadwalId, // ⭐ NEW
  onGenerated
}: GerbongCardProps) {
  const hasSeat = kursi_count > 0;
  
  const seatAvailable = available_count ?? kursi_count;
  const seatBooked = booked_count ?? 0;
  
  const occupancyRate = hasSeat && selectedJadwalId ? (seatBooked / kuota) * 100 : 0;
  
  const { generate, loading } = useGenerateSeats();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsGenerating(true);
    try {
      await generate(id);
      toast.success(`Seat ${nama_gerbong} berhasil di-generate!`);
      onGenerated?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal generate seat');
    } finally {
      setIsGenerating(false);
    }
  };

  const getKelasVariant = (kelas: string) => {
    if (kelas === 'eksekutif') return 'default';
    if (kelas === 'bisnis') return 'secondary';
    return 'outline';
  };

  // ⭐ Build route dengan query param jadwal (jika ada)
  let detailRoute = `/dashboard/seat/${keretaId}/${id}` as Route;
  if (selectedJadwalId) {
    detailRoute = `${detailRoute}?jadwal_id=${selectedJadwalId}` as Route;
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow ${!hasSeat ? 'border-yellow-500 border-2' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">🚃 {nama_gerbong}</CardTitle>
            <CardDescription>
              <Badge variant={getKelasVariant(kelas_gerbong)}>
                {kelas_gerbong}
              </Badge>
            </CardDescription>
          </div>
          {!hasSeat && (
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {hasSeat ? (
          <>
            {/* ⭐ Hanya tampilkan stats jika ada filter jadwal */}
            {selectedJadwalId ? (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span className="font-medium">{occupancyRate.toFixed(0)}%</span>
                  </div>
                  <Progress value={occupancyRate} className="h-2" />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">{seatAvailable} tersedia</span>
                  <span className="text-muted-foreground">dari {kuota}</span>
                </div>
              </>
            ) : (
              <div className="text-center py-4 bg-muted/50 rounded-md">
                <p className="text-sm text-muted-foreground">
                  {kursi_count} seat telah di-generate
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pilih jadwal untuk melihat ketersediaan
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4 bg-yellow-50 rounded-md border border-yellow-200">
            <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-yellow-700 font-medium">Seat belum tersedia</p>
            <p className="text-xs text-yellow-600 mt-1">Kapasitas: {kuota} seat</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col gap-2">
        {hasSeat ? (
          <Link href={detailRoute} className="w-full">
            <Button className="w-full">
              Lihat Seat Map →
            </Button>
          </Link>
        ) : (
          <>
            <Button 
              className="w-full" 
              variant="secondary"
              onClick={handleGenerate}
              disabled={isGenerating || loading}
            >
              {isGenerating || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Seat
                </>
              )}
            </Button>
            
            <Link href={detailRoute} className="w-full">
              <Button className="w-full" variant="outline" size="sm">
                Lihat Detail (Kosong)
              </Button>
            </Link>
          </>
        )}
      </CardFooter>
    </Card>
  );
}