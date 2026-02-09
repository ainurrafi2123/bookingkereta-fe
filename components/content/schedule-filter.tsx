// components/search/schedule-filters.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { SearchFilters } from '@/lib/types/search';
import { X } from 'lucide-react';

interface ScheduleFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

export function ScheduleFilters({ filters, onFiltersChange, onReset }: ScheduleFiltersProps) {
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.hargaMin || 0,
    filters.hargaMax || 1000000,
  ]);

  const handleKelasChange = (kelas: 'ekonomi' | 'bisnis' | 'eksekutif', checked: boolean) => {
    const currentKelas = filters.kelas || [];
    const newKelas = checked
      ? [...currentKelas, kelas]
      : currentKelas.filter((k) => k !== kelas);
    
    onFiltersChange({ ...filters, kelas: newKelas });
  };

  const handleWaktuChange = (waktu: string, checked: boolean) => {
    const currentWaktu = filters.waktu || [];
    const newWaktu = checked
      ? [...currentWaktu, waktu]
      : currentWaktu.filter((w) => w !== waktu);
    
    onFiltersChange({ ...filters, waktu: newWaktu });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFiltersChange({
      ...filters,
      hargaMin: value[0],
      hargaMax: value[1],
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const hasActiveFilters = 
    (filters.kelas && filters.kelas.length > 0) ||
    (filters.waktu && filters.waktu.length > 0) ||
    filters.hargaMin !== undefined ||
    filters.hargaMax !== undefined;

  return (
    <div className="space-y-4">
      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Reset Filter
        </Button>
      )}

      {/* Filter Kelas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Kelas Kereta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ekonomi"
              checked={filters.kelas?.includes('ekonomi')}
              onCheckedChange={(checked) =>
                handleKelasChange('ekonomi', checked as boolean)
              }
            />
            <Label
              htmlFor="ekonomi"
              className="text-sm font-normal cursor-pointer"
            >
              Ekonomi
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="bisnis"
              checked={filters.kelas?.includes('bisnis')}
              onCheckedChange={(checked) =>
                handleKelasChange('bisnis', checked as boolean)
              }
            />
            <Label
              htmlFor="bisnis"
              className="text-sm font-normal cursor-pointer"
            >
              Bisnis
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="eksekutif"
              checked={filters.kelas?.includes('eksekutif')}
              onCheckedChange={(checked) =>
                handleKelasChange('eksekutif', checked as boolean)
              }
            />
            <Label
              htmlFor="eksekutif"
              className="text-sm font-normal cursor-pointer"
            >
              Eksekutif
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Filter Waktu Keberangkatan */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Waktu Keberangkatan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pagi"
              checked={filters.waktu?.includes('pagi')}
              onCheckedChange={(checked) =>
                handleWaktuChange('pagi', checked as boolean)
              }
            />
            <Label htmlFor="pagi" className="text-sm font-normal cursor-pointer">
              Pagi (00:00 - 11:59)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="siang"
              checked={filters.waktu?.includes('siang')}
              onCheckedChange={(checked) =>
                handleWaktuChange('siang', checked as boolean)
              }
            />
            <Label htmlFor="siang" className="text-sm font-normal cursor-pointer">
              Siang (12:00 - 17:59)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="malam"
              checked={filters.waktu?.includes('malam')}
              onCheckedChange={(checked) =>
                handleWaktuChange('malam', checked as boolean)
              }
            />
            <Label htmlFor="malam" className="text-sm font-normal cursor-pointer">
              Malam (18:00 - 23:59)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Filter Harga */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Rentang Harga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            min={0}
            max={1000000}
            step={50000}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}