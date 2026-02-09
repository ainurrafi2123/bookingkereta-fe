// app/dashboard/kursi/page.tsx
'use client';

import { useTrainsSummary } from '@/features/seats/useTrainsSummary';
import { TrainCard } from '@/components/content/TrainCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function KursiPage() {
  const { trains, loading, error } = useTrainsSummary();

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto ">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Monitoring Kursi</h1>
        <p className="text-muted-foreground">Pilih kereta untuk melihat detail gerbong dan kursi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))
        ) : (
          trains.map((train) => <TrainCard key={train.id} {...train} />)
        )}
      </div>
    </div>
  );
}