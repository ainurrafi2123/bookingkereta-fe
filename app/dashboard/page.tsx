'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconTrain, 
  IconLayoutGrid, 
  IconUsers, 
  IconCalendar, 
  IconTicket, 
  IconCurrencyDollar 
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDashboardStats } from '@/features/dashboard/useDashboardStats';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Route } from 'next';

export default function DashboardHome() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { stats, loading, error } = useDashboardStats();

  // Auth check in useEffect to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      router.replace('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as { role: string; name?: string };
      if (parsedUser.role !== 'petugas') {
        router.replace('/');
        return;
      }
      setIsAuthorized(true);
    } catch {
      localStorage.removeItem('user');
      router.replace('/login');
    }
  }, [router]);

  if (!isMounted || !isAuthorized) {
    return null;
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Selamat Datang, Petugas!
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card 
              key={i} 
              className="
                @container/card 
                bg-gradient-to-t from-primary/5 to-card 
                dark:from-primary/10 dark:to-muted/50 
                shadow-xs
              "
              data-slot="card"
            >
              <CardHeader>
                <Skeleton className="h-4 w-32 mb-1" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-4 w-3/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Selamat Datang, Petugas!
        </h1>
        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">
            {error || 'Gagal memuat statistik dashboard'}
          </p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Kereta',
      value: stats.total_trains,
      icon: IconTrain,
      href: '/dashboard/kereta' as Route,
      description: 'Kereta terdaftar',
      color: 'text-blue-600',
    },
    {
      title: 'Total Gerbong',
      value: stats.total_carriages,
      icon: IconLayoutGrid,
      href: '/dashboard/carriages' as Route,
      description: 'Gerbong tersedia',
      color: 'text-purple-600',
    },
    {
      title: 'Total Pengguna',
      value: stats.total_users,
      icon: IconUsers,
      href: null,
      description: 'Akun terdaftar',
      color: 'text-green-600',
    },
    {
      title: 'Jadwal Aktif',
      value: stats.active_schedules,
      icon: IconCalendar,
      href: '/dashboard/schedules' as Route,
      description: 'Jadwal mendatang',
      color: 'text-orange-600',
    },
    {
      title: 'Total Pemesanan',
      value: stats.total_bookings,
      icon: IconTicket,
      href: '/dashboard/bookings' as Route,
      description: 'Tiket terjual',
      growth: stats.growth.bookings,
      color: 'text-indigo-600',
    },
    {
      title: 'Total Pendapatan',
      value: formatCurrency(stats.total_revenue),
      icon: IconCurrencyDollar,
      href: null,
      description: 'Revenue keseluruhan',
      growth: stats.growth.revenue,
      color: 'text-emerald-600',
      isRevenue: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        Selamat Datang, Petugas!
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const CardWrapper = (stat.href ? Link : 'div') as any;
          const cardProps = stat.href ? { href: stat.href } : {};

          return (
            <CardWrapper key={index} {...cardProps}>
              <Card 
                className={`
                  @container/card 
                  bg-gradient-to-t from-primary/5 to-card 
                  dark:from-primary/10 dark:to-muted/50 
                  shadow-xs 
                  ${stat.href ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
                `}
                data-slot="card"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardDescription className="line-clamp-1">{stat.title}</CardDescription>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>

                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl mt-1">
                    {stat.isRevenue ? stat.value : stat.value.toLocaleString('id-ID')}
                  </CardTitle>

                  {stat.growth !== undefined && (
                    <CardAction>
                      <Badge 
                        variant="outline" 
                        className={`gap-1 ${
                          stat.growth >= 0 
                            ? 'border-green-500 text-green-600 bg-green-50/50 dark:bg-green-950/30' 
                            : 'border-red-500 text-red-600 bg-red-50/50 dark:bg-red-950/30'
                        }`}
                      >
                        {stat.growth >= 0 ? (
                          <IconTrendingUp className="size-3.5" />
                        ) : (
                          <IconTrendingDown className="size-3.5" />
                        )}
                        {stat.growth >= 0 ? '+' : ''}{stat.growth}%
                      </Badge>
                    </CardAction>
                  )}
                </CardHeader>

                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex items-center gap-1.5 font-medium">
                    {stat.description}
                  </div>
                  {stat.growth !== undefined && (
                    <div className="text-muted-foreground">
                      {stat.growth >= 0 ? 'Meningkat' : 'Menurun'} dalam 30 hari terakhir
                    </div>
                  )}
                </CardFooter>
              </Card>
            </CardWrapper>
          );
        })}
      </div>

      {/* Additional info section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Pemesanan</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">Terkonfirmasi</span>
              <span className="font-semibold">{stats.booking_status.booked.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">Dibatalkan</span>
              <span className="font-semibold">{stats.booking_status.cancelled.toLocaleString('id-ID')}</span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pemesanan Terbaru</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">30 Hari Terakhir</span>
              <span className="font-semibold">{stats.recent_bookings.toLocaleString('id-ID')}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Rata-rata {Math.round(stats.recent_bookings / 30)} pemesanan per hari
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}