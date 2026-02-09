import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Route } from 'next';
import Link from 'next/link';

interface TrainCardProps {
  id: number;
  nama_kereta: string;
  kelas_kereta: string;
  total_gerbong: number;
  kursi_tersedia: number;
  total_kursi: number;
  kursi_terbooked?: number;
}

export function TrainCard({ 
  id, 
  nama_kereta, 
  kelas_kereta, 
  total_gerbong, 
  kursi_tersedia, 
  total_kursi,
  kursi_terbooked = 0
}: TrainCardProps) {
  // ⭐ Handle edge case: total_kursi = 0
  const occupancyRate = total_kursi > 0 
    ? (kursi_terbooked / total_kursi) * 100 
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">🚄 {nama_kereta}</CardTitle>
            <CardDescription>{kelas_kereta}</CardDescription>
          </div>
          <Badge variant="secondary">{total_gerbong} Gerbong</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {total_kursi > 0 ? (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Okupansi</span>
                <span className="font-medium">{occupancyRate.toFixed(0)}%</span>
              </div>
              <Progress value={occupancyRate} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Tersedia</p>
                <p className="text-lg font-bold text-green-600">{kursi_tersedia}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Kursi</p>
                <p className="text-lg font-bold">{total_kursi}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4 bg-muted/50 rounded-md">
            <p className="text-sm text-muted-foreground">
              Kursi belum di-generate
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href={`/dashboard/seat/${id}` as Route}
          className="w-full"
        >
          <Button className="w-full">Lihat Gerbong →</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}