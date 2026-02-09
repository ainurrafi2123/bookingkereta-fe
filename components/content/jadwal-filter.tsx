// features/seats/components/JadwalFilter.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJadwalList } from '@/features/seats/useJadwalList';
import { Calendar, Clock, Loader2 } from 'lucide-react';

interface JadwalFilterProps {
  keretaId: string | number;
  onJadwalChange: (jadwalId: string | null) => void;
  selectedJadwalId?: string | null;
}

export function JadwalFilter({ keretaId, onJadwalChange, selectedJadwalId }: JadwalFilterProps) {
  const { jadwals, loading } = useJadwalList(keretaId);
  const [internalValue, setInternalValue] = useState<string>(selectedJadwalId || '');

  useEffect(() => {
    setInternalValue(selectedJadwalId || '');
  }, [selectedJadwalId]);

  const handleValueChange = (value: string) => {
    setInternalValue(value);
    onJadwalChange(value === 'all' ? null : value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Filter Jadwal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Select
            value={internalValue}
            onValueChange={handleValueChange}
            disabled={loading || jadwals.length === 0}
          >
            <SelectTrigger className="h-9"> {/* ⭐ Lebih kecil */}
              <SelectValue placeholder={
                loading ? "Memuat jadwal..." : "Pilih jadwal"
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="text-sm">Semua Jadwal (Master Data)</span>
              </SelectItem>
              
              {jadwals.length > 0 && (
                <>
                  {jadwals.map((jadwal) => (
                    <SelectItem key={jadwal.id} value={jadwal.id.toString()}>
                      <div className="flex flex-col gap-0.5 py-1">
                        <span className="font-medium text-sm">{jadwal.kode_jadwal}</span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(jadwal.tanggal_berangkat)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(jadwal.tanggal_berangkat)}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {jadwal.asal_keberangkatan} → {jadwal.tujuan_keberangkatan}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Memuat jadwal...</span>
            </div>
          )}
          
          {!loading && jadwals.length === 0 && (
            <p className="text-xs text-yellow-600">
              Tidak ada jadwal aktif untuk kereta ini
            </p>
          )}

          {!loading && jadwals.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {jadwals.length} jadwal tersedia
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}