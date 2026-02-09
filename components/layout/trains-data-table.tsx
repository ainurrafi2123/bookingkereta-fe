// components/trains/train-data-table.tsx
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
import { TrainDetailDialog } from '../overlay/trains-detail-dialog';
import { TrainFormDialog } from '../overlay/trains-form-dialog';
import { TrainDeleteDialog } from '../overlay/trains-delete-dialog';;
import { MoreHorizontal, Search, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Train } from '@/lib/types/trains';

interface TrainDataTableProps {
  data: Train[];
  onRefresh: () => void;
}

export function TrainDataTable({ data, onRefresh }: TrainDataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
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

  const columns: ColumnDef<Train>[] = [
    {
      accessorKey: 'kode_kereta',
      header: 'Kode',
      cell: ({ row }) => (
        <span className="font-mono font-medium">{row.getValue('kode_kereta')}</span>
      ),
    },
    {
      accessorKey: 'nama_kereta',
      header: 'Nama Kereta',
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue('nama_kereta')}</span>
      ),
      filterFn: (row, id, value) => {
        const nama = row.getValue('nama_kereta') as string;
        const kode = row.original.kode_kereta;
        const searchValue = value.toLowerCase();
        return (
          nama.toLowerCase().includes(searchValue) ||
          kode.toLowerCase().includes(searchValue)
        );
      },
    },
    {
      accessorKey: 'kelas_kereta',
      header: 'Kelas',
      cell: ({ row }) => {
        const kelas = row.getValue('kelas_kereta') as string;
        return (
          <Badge variant={getKelasVariant(kelas)}>
            {kelas.charAt(0).toUpperCase() + kelas.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'deskripsi',
      header: 'Deskripsi',
      cell: ({ row }) => {
        const desc = row.getValue('deskripsi') as string | null;
        return (
          <span className="text-muted-foreground line-clamp-1">
            {desc || '—'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const train = row.original;

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
                  setSelectedTrain(train);
                  setDetailOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => {
                  setSelectedTrain(train);
                  setEditOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Kereta
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => {
                  setSelectedTrain(train);
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Kereta
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
              placeholder="Cari kereta (nama, kode)..."
              value={(table.getColumn('nama_kereta')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('nama_kereta')?.setFilterValue(event.target.value)
              }
              className="pl-9"
            />
          </div>
          
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kereta
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
                      : 'Belum ada data kereta'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <TrainDetailDialog
        trainId={selectedTrain?.id || null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <TrainFormDialog
        train={selectedTrain}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={() => handleSuccess('Kereta berhasil diupdate')}
        mode="edit"
      />

      <TrainFormDialog
        train={null}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => handleSuccess('Kereta berhasil ditambahkan')}
        mode="create"
      />

      <TrainDeleteDialog
        train={selectedTrain}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={() => handleSuccess('Kereta berhasil dihapus')}
      />
    </>
  );
}