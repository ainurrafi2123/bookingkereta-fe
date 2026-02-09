'use client';

import { notFound } from 'next/navigation';
import { IconTrendingUp } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function DashboardHome() {
  // Cek otorisasi sebelum render
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      notFound();
    }

    try {
      const parsedUser = JSON.parse(storedUser) as { role: string; name?: string };

      if (parsedUser.role !== 'petugas') {
        notFound();
      }
    } catch {
      localStorage.removeItem('user');
      notFound();
    }
  }

  // Jika masih di server-side, return null atau loading state
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        Selamat Datang, Petugas!
      </h1>

      <div
        className={`
          grid grid-cols-1 gap-4 
          md:grid-cols-3
          *:data-[slot=card]:from-primary/5 
          *:data-[slot=card]:to-card 
          dark:*:data-[slot=card]:bg-card 
          *:data-[slot=card]:bg-linear-to-t 
          *:data-[slot=card]:shadow-xs
        `}
      >
        {/* Card 1 - Total Users */}
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              120
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1">
                <IconTrendingUp className="size-3.5" />
                +8.2%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
              Bertambah bulan ini <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Total akun terdaftar
            </div>
          </CardFooter>
        </Card>

        {/* Card 2 - Total Events */}
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Total Events</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              10
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1">
                <IconTrendingUp className="size-3.5" />
                +25%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
              Event baru ditambahkan <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Dalam 30 hari terakhir
            </div>
          </CardFooter>
        </Card>

        {/* Card 3 - Tickets Sold */}
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Tickets Sold</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              350
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1">
                <IconTrendingUp className="size-3.5" />
                +14.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
              Penjualan tiket meningkat <IconTrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Total tiket terjual semua event
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}