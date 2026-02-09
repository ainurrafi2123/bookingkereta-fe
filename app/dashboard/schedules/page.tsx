// app/dashboard/schedules/page.tsx
'use client';

import { useState } from 'react';
import { useSchedules } from '@/features/schedules/useSchedules';
import { useTrains } from '@/features/trains/useTrains';
import { ScheduleDataTable } from '@/components/layout/schedules-data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Train } from 'lucide-react';
import { ScheduleStatus } from '@/lib/types/schedules';

export default function SchedulesPage() {
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | 'all'>('active');
  const [trainFilter, setTrainFilter] = useState<number | undefined>(undefined);

  const { schedules, loading, error, refetch } = useSchedules({
    status: statusFilter,
    id_kereta: trainFilter,
  });

  const { trains, loading: trainsLoading } = useTrains();

  // Count schedules by status
  const activeCount = schedules.filter((s) => s.status === 'active').length;
  const completedCount = schedules.filter((s) => s.status === 'completed').length;
  const cancelledCount = schedules.filter((s) => s.status === 'cancelled').length;
  const maintenanceCount = schedules.filter((s) => s.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">
              Pengelolaan Jadwal Kereta
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola jadwal keberangkatan dan kedatangan
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

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as ScheduleStatus | 'all')}
        >
          <TabsList>
            <TabsTrigger value="all">
              Semua ({schedules.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Aktif ({activeCount})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Selesai ({completedCount})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Dibatalkan ({cancelledCount})
            </TabsTrigger>
            <TabsTrigger value="maintenance">
              Maintenance ({maintenanceCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Train Filter */}
        <div className="flex items-center gap-2">
          <Train className="h-4 w-4 text-muted-foreground" />
          <Select
            value={trainFilter?.toString() || 'all'}
            onValueChange={(value) =>
              setTrainFilter(value === 'all' ? undefined : parseInt(value))
            }
            disabled={trainsLoading}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter Kereta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kereta</SelectItem>
              {trains.map((train) => (
                <SelectItem key={train.id} value={train.id.toString()}>
                  {train.nama_kereta}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
        <ScheduleDataTable data={schedules} onRefresh={refetch} />
      )}
    </div>
  );
}