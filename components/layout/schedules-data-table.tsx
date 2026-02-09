// components/schedules/schedule-data-table.tsx
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
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScheduleDetailDialog } from '@/components/overlay/schedules-detail-dialog';
import { ScheduleFormDialog } from '@/components/overlay/schedules-form-dialog';
import { ScheduleDeleteDialog } from '@/components/overlay/schedules-delete-dialog';
import {
  MoreHorizontal,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowRight,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
} from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateSchedule } from '@/features/schedules/useUpdateSchedules';

import { Schedule, ScheduleStatus } from '@/lib/types/schedules';

interface ScheduleDataTableProps {
  data: Schedule[];
  onRefresh: () => void;
}

export function ScheduleDataTable({ data, onRefresh }: ScheduleDataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { updateSchedule } = useUpdateSchedule();

  const handleSuccess = (message: string) => {
    toast.success(message);
    onRefresh();
  };

  // Quick status update
  const handleQuickStatusUpdate = async (schedule: Schedule, status: ScheduleStatus) => {
    const result = await updateSchedule(schedule.id, { status });
    if (result) {
      toast.success(`Status diubah menjadi ${getStatusLabel(status)}`);
      onRefresh();
    }
  };

  const getStatusLabel = (status: ScheduleStatus) => {
    const labels = {
      active: 'Aktif',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
      maintenance: 'Maintenance',
    };
    return labels[status];
  };

  const getStatusVariant = (status: ScheduleStatus) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      cancelled: 'destructive',
      maintenance: 'outline',
    };
    return variants[status] as 'default' | 'secondary' | 'destructive' | 'outline';
  };

  const getStatusIcon = (status: ScheduleStatus) => {
    const icons = {
      active: CheckCircle2,
      completed: CheckCircle2,
      cancelled: XCircle,
      maintenance: Wrench,
    };
    const Icon = icons[status];
    return <Icon className="h-3 w-3" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateProgress = (terjual: number, total: number) => {
    return total > 0 ? (terjual / total) * 100 : 0;
  };

  const columns: ColumnDef<Schedule>[] = [
    {
      accessorKey: 'kode_jadwal',
      header: 'Kode',
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium">
          {row.getValue('kode_jadwal')}
        </span>
      ),
    },
    {
      id: 'route',
      header: 'Rute',
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <div className="flex items-center gap-2 min-w-[200px]">
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {schedule.asal_keberangkatan}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(schedule.tanggal_berangkat)}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {schedule.tujuan_keberangkatan}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(schedule.tanggal_kedatangan)}
              </span>
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const schedule = row.original;
        const searchValue = value.toLowerCase();
        return (
          schedule.asal_keberangkatan.toLowerCase().includes(searchValue) ||
          schedule.tujuan_keberangkatan.toLowerCase().includes(searchValue) ||
          schedule.kode_jadwal.toLowerCase().includes(searchValue) ||
          schedule.kereta?.nama_kereta.toLowerCase().includes(searchValue) ||
          false
        );
      },
    },
    {
      id: 'kereta',
      header: 'Kereta',
      cell: ({ row }) => {
        const kereta = row.original.kereta;
        return kereta ? (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{kereta.nama_kereta}</span>
            <span className="text-xs text-muted-foreground font-mono">
              {kereta.kode_kereta}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      id: 'kursi',
      header: 'Kursi',
      cell: ({ row }) => {
        const schedule = row.original;
        const progress = calculateProgress(schedule.kursi_terjual, schedule.kuota_total);

        return (
          <div className="min-w-[120px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">
                {schedule.kursi_tersedia}/{schedule.kuota_total}
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        );
      },
    },
    {
      id: 'harga',
      header: 'Harga',
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <div className="flex flex-col text-xs">
            <span className="font-medium">{formatCurrency(schedule.harga_dewasa)}</span>
            <span className="text-muted-foreground">
              Anak: {formatCurrency(schedule.harga_anak)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as ScheduleStatus;
        return (
          <Badge variant={getStatusVariant(status)} className="gap-1">
            {getStatusIcon(status)}
            {getStatusLabel(status)}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const schedule = row.original;

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
                  setSelectedSchedule(schedule);
                  setDetailOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Quick Status Update */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  Ubah Status
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => handleQuickStatusUpdate(schedule, 'active')}
                    disabled={schedule.status === 'active'}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Aktifkan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleQuickStatusUpdate(schedule, 'completed')}
                    disabled={schedule.status === 'completed'}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Selesai
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleQuickStatusUpdate(schedule, 'cancelled')}
                    disabled={schedule.status === 'cancelled'}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Batalkan
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleQuickStatusUpdate(schedule, 'maintenance')}
                    disabled={schedule.status === 'maintenance'}
                  >
                    <Wrench className="mr-2 h-4 w-4" />
                    Maintenance
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem
                onSelect={() => {
                  setSelectedSchedule(schedule);
                  setEditOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Jadwal
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => {
                  setSelectedSchedule(schedule);
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Jadwal
              </DropdownMenuItem>
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
        <div className="flex items-center justify-between gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari rute, kode, kereta..."
              value={(table.getColumn('route')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('route')?.setFilterValue(event.target.value)
              }
              className="pl-9"
            />
          </div>

          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jadwal
          </Button>
        </div>

        <div className="rounded-md border">
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
                      : 'Belum ada data jadwal'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ScheduleDetailDialog
        scheduleId={selectedSchedule?.id || null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <ScheduleFormDialog
        schedule={selectedSchedule}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={() => handleSuccess('Jadwal berhasil diupdate')}
        mode="edit"
      />

      <ScheduleFormDialog
        schedule={null}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => handleSuccess('Jadwal berhasil ditambahkan')}
        mode="create"
      />

      <ScheduleDeleteDialog
        schedule={selectedSchedule}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={() => handleSuccess('Jadwal berhasil dihapus')}
      />
    </>
  );
}