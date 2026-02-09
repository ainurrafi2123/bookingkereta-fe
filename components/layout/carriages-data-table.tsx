// components/carriages/carriage-data-table.tsx
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
import { CarriageDetailDialog } from '@/components/overlay/carriage-detail-dialog';
import { CarriageFormDialog } from '@/components/overlay/carriage-form-dialog';
import { CarriageDeleteDialog } from '@/components/overlay/carriage-delete-dialog';
import { MoreHorizontal, Search, Eye, Edit, Trash2, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

import { Carriage } from '@/lib/types/carriages';

interface CarriageDataTableProps {
  data: Carriage[];
  onRefresh: () => void;
}

export function CarriageDataTable({ data, onRefresh }: CarriageDataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedCarriage, setSelectedCarriage] = useState<Carriage | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleSuccess = (message: string) => {
    toast.success(message);
    onRefresh();
  };

  const getKelasVariant = (kelas: string) => {
    switch (kelas.toLowerCase()) {
      case 'eksekutif':
        return 'default';
      case 'bisnis':
        return 'secondary';
      case 'ekonomi':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const columns: ColumnDef<Carriage>[] = [
    {
      accessorKey: 'nama_gerbong',
      header: 'Nama Gerbong',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('nama_gerbong')}</span>
      ),
      filterFn: (row, id, value) => {
        const nama = row.getValue('nama_gerbong') as string;
        const kereta = row.original.kereta?.nama_kereta || '';
        const searchValue = value.toLowerCase();
        return (
          nama.toLowerCase().includes(searchValue) ||
          kereta.toLowerCase().includes(searchValue)
        );
      },
    },
    {
      id: 'kereta',
      header: 'Kereta',
      cell: ({ row }) => {
        const kereta = row.original.kereta;
        return kereta ? (
          <div className="flex flex-col gap-0.5">
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
      accessorKey: 'kelas_gerbong',
      header: 'Kelas',
      cell: ({ row }) => {
        const kelas = row.getValue('kelas_gerbong') as string;
        return (
          <Badge variant={getKelasVariant(kelas)}>
            {kelas.charAt(0).toUpperCase() + kelas.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'kuota',
      header: 'Kuota',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue('kuota')}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const carriage = row.original;

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
                  setSelectedCarriage(carriage);
                  setDetailOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => {
                  setSelectedCarriage(carriage);
                  setEditOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Gerbong
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => {
                  setSelectedCarriage(carriage);
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Gerbong
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
              placeholder="Cari gerbong (nama, kereta)..."
              value={(table.getColumn('nama_gerbong')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('nama_gerbong')?.setFilterValue(event.target.value)
              }
              className="pl-9"
            />
          </div>

          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Gerbong
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
                      : 'Belum ada data gerbong'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CarriageDetailDialog
        carriageId={selectedCarriage?.id || null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <CarriageFormDialog
        carriage={selectedCarriage}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={() => handleSuccess('Gerbong berhasil diupdate')}
        mode="edit"
      />

      <CarriageFormDialog
        carriage={null}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => handleSuccess('Gerbong berhasil ditambahkan')}
        mode="create"
      />

      <CarriageDeleteDialog
        carriage={selectedCarriage}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={() => handleSuccess('Gerbong berhasil dihapus')}
      />
    </>
  );
}