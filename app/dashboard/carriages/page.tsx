// app/dashboard/carriages/page.tsx
'use client';

import { useCarriages } from '@/features/carriages/useCarriages';
import { CarriageDataTable } from '@/components/layout/carriages-data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { LayoutGrid } from 'lucide-react';

export default function CarriagesPage() {
  const { carriages, loading, error, refetch } = useCarriages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">
              Pengelolaan Gerbong
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola gerbong pada setiap kereta
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          <p className="font-medium">Terjadi Kesalahan</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <CarriageDataTable data={carriages} onRefresh={refetch} />
      )}
    </div>
  );
}