// components/search/schedules-result.tsx
'use client';

import { ScheduleFilters } from './schedule-filter';
import { ScheduleCard } from './schedule-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Filter, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSearchSchedules } from '@/features/schedules/useSearchScedules';
import { SearchParams } from '@/lib/types/search';

interface ScheduleResultsProps {
  searchParams: SearchParams;
}

export function ScheduleResults({ searchParams }: ScheduleResultsProps) {
  const { schedules, loading, error, filters, setFilters } = useSearchSchedules(searchParams);

  const handleResetFilters = () => {
    setFilters({});
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters - Desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-6">
          <ScheduleFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>
      </aside>

      {/* Filters - Mobile */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              <Filter className="mr-2 h-4 w-4" />
              Filter & Urutkan
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <div className="mt-6">
              <ScheduleFilters
                filters={filters}
                onFiltersChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Results */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Ditemukan <span className="font-semibold">{schedules.length}</span> jadwal
          </p>
        </div>

        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <ScheduleCard 
              key={schedule.id} 
              schedule={schedule}
              passengerCounts={{
                adults: searchParams.adults || 1,
                elderly: searchParams.elderly || 0,
                youth: searchParams.youth || 0,
              }}
            />
          ))
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tidak ada jadwal yang tersedia untuk rute dan tanggal yang dipilih.
              Coba ubah pencarian Anda.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}