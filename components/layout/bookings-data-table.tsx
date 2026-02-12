// components/layout/bookings-data-table.tsx
'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { BookingDetailDialog } from '../overlay/booking-detail-dialog';
import { BookingCancelDialog } from '../overlay/booking-cancel-dialog';
import {
  MoreHorizontal,
  Search,
  Eye,
  XCircle,
  Calendar as CalendarIcon,
  Train,
  X,
  RefreshCcw,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Booking } from '@/lib/types/manage-booking';

interface BookingsDataTableProps {
  data: Booking[];
  loading: boolean;
  onRefresh: () => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  month: string | undefined;
  setMonth: (month: string | undefined) => void;
}

export function BookingsDataTable({
  data,
  loading,
  onRefresh,
  date,
  setDate,
  month,
  setMonth,
}: BookingsDataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return {
      value: format(d, 'yyyy-MM'),
      label: format(d, 'MMMM yyyy', { locale: id }),
    };
  });

  const clearFilters = () => {
    setDate(undefined);
    setMonth(undefined);
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'Terkonfirmasi';
      case 'cancelled':
        return 'Dibatalkan';
      case 'completed':
        return 'Selesai';
      case 'pending':
        return 'Menunggu';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: 'kode_tiket',
      header: 'Kode Tiket',
      cell: ({ row }) => (
        <span className="font-mono font-medium">{row.getValue('kode_tiket')}</span>
      ),
    },
    {
      accessorKey: 'tanggal_pembelian',
      header: 'Tanggal Pembelian',
      cell: ({ row }) => {
        const dateStr = row.getValue('tanggal_pembelian') as string;
        if (!dateStr) return '-';
        
        // Backend already formats in Asia/Jakarta timezone as 'dd-MM-yyyy HH:mm'
        // Just display it as-is, splitting date and time for better presentation
        const parts = dateStr.split(' ');
        if (parts.length === 2) {
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm">{parts[0]}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{parts[1]}</span>
              </div>
            </div>
          );
        }
        return <span className="text-sm">{dateStr}</span>;
      },
    },
    {
      accessorKey: 'pembeli',
      header: 'Pemesan',
      cell: ({ row }) => {
        const pembeli = row.original.pembeli;
        if (pembeli) {
          return (
            <div className="flex flex-col">
              <span className="font-medium text-sm">{pembeli.nama_penumpang}</span>
              <span className="text-xs text-muted-foreground">{pembeli.nik}</span>
            </div>
          );
        }
        
        // Fallback to searching in detail_pembelian if available
        const firstPassenger = row.original.detail_pembelian?.[0];
        if (firstPassenger) {
           return (
            <div className="flex flex-col">
              <span className="font-medium text-sm">{firstPassenger.nama_penumpang}</span>
              <span className="text-xs text-muted-foreground">{firstPassenger.nik}</span>
            </div>
          );
        }

        return '—';
      },
      filterFn: (row, id, value) => {
        const pembeli = row.original.pembeli;
        const name = (pembeli?.nama_penumpang || row.original.detail_pembelian?.[0]?.nama_penumpang || '').toLowerCase();
        const code = row.original.kode_tiket.toLowerCase();
        const search = value.toLowerCase();
        return name.includes(search) || code.includes(search);
      }
    },
    {
      accessorKey: 'jadwal_kereta',
      header: 'Perjalanan',
      cell: ({ row }) => {
        const jadwal = row.original.jadwal_kereta;
        if (!jadwal) return '—';

        // Extract times from strings "dd-MM-yyyy HH:mm"
        const timeBerangkat = jadwal.tanggal_berangkat?.split(' ')[1] || '--:--';
        const timeTiba = jadwal.tanggal_kedatangan?.split(' ')[1] || '--:--';

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-sm font-medium">
               <Train className="h-3 w-3" />
               {jadwal.kereta?.nama_kereta}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span>{jadwal.asal_keberangkatan}</span>
              <span>→</span>
              <span>{jadwal.tujuan_keberangkatan}</span>
            </div>
            <div className="text-[10px] font-mono bg-slate-100 w-fit px-1.5 py-0.5 rounded text-slate-600">
              {timeBerangkat} - {timeTiba}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'total_harga',
      header: 'Total',
      cell: ({ row }) => {
        const totalHarga = row.getValue('total_harga');
        // Backend already formats as string like "150.000"
        if (typeof totalHarga === 'string') {
          return (
            <span className="font-semibold text-blue-600">
              Rp {totalHarga}
            </span>
          );
        }
        // Fallback if it's a number
        return (
          <span className="font-semibold text-blue-600">
            {formatCurrency(totalHarga as number)}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <Badge variant={getStatusVariant(status)}>
            {getStatusLabel(status)}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const booking = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              
              <DropdownMenuItem
                onSelect={() => {
                  setSelectedBooking(booking);
                  setDetailOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>

              {booking.status === 'booked' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={() => {
                      setSelectedBooking(booking);
                      setCancelOpen(true);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Batalkan Tiket
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari pemesan atau kode tiket..."
              value={(table.getColumn('pembeli')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('pembeli')?.setFilterValue(event.target.value)
              }
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  size="sm"
                  className={cn(
                    'w-[180px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'dd MMM yyyy', { locale: id }) : <span>Pilih Tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setMonth(undefined);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Month Filter */}
            <Select
              key={month ? month : 'month-reset'}
              value={month}
              onValueChange={(val) => {
                setMonth(val);
                setDate(undefined);
              }}
            >
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(date || month) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2">
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="h-9"
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {columnFilters.length > 0
                      ? 'Tidak ada hasil pencarian'
                      : 'Belum ada data pemesanan'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <BookingDetailDialog
        bookingId={selectedBooking?.id || null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <BookingCancelDialog
        booking={selectedBooking}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onSuccess={() => {
          toast.success('Pemesanan berhasil dibatalkan');
          onRefresh();
        }}
      />
    </>
  );
}
