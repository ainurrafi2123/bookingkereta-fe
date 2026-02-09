// app/dashboard/trains/page.tsx
"use client";

import { useTrains } from "@/features/trains/useTrains";
import { TrainDataTable } from "@/components/layout/trains-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Train } from "lucide-react";

export default function TrainsPage() {
  const { trains, loading, error, refetch } = useTrains();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Train className="h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">
              Pengelolaan Kereta
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data kereta yang tersedia
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
        <TrainDataTable data={trains} onRefresh={refetch} />
      )}
    </div>
  );
}
