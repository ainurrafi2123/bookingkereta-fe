// components/users/user-data-table.tsx
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { UserDetailDialog } from '../overlay/user-detail-dialog';
import { EditUserDialog } from '../overlay/update-user-dialog';
import { DeleteUserDialog } from '../overlay/delete-user-dialog';
import {
  MoreHorizontal,
  Search,
  Eye,
  Copy,
  Edit,
  KeyRound,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner'; // ← Import dari sonner

import { User } from '@/lib/types/user';
import { getPhotoUrl } from '@/lib/fetcher';

interface UserDataTableProps {
  data: User[];
  onRefresh: () => void;
}

export function UserDataTable({ data, onRefresh }: UserDataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  // State untuk dialogs
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Handler untuk copy email
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success('Email disalin', {
      description: `${email} telah disalin ke clipboard`,
    });
  };

  // Handler untuk success callbacks
  const handleUpdateSuccess = () => {
    toast.success('User berhasil diupdate');
    onRefresh();
  };

  const handleDeleteSuccess = () => {
    toast.success('User berhasil dihapus');
    onRefresh();
  };

  const columns: ColumnDef<User>[] = [
    {
      id: 'profile',
      header: 'User',
      cell: ({ row }) => {
        const user = row.original;
        const displayName = user.username || user.name || user.email.split('@')[0];
        const initials = displayName
          .split(/[\s@.]+/)
          .map((part) => part[0]?.toUpperCase() || '')
          .join('')
          .slice(0, 2) || '?';

        const photoUrl = getPhotoUrl(user.profile_photo);

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              {photoUrl && (
                <AvatarImage src={photoUrl} alt={displayName} />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <span className="font-medium leading-none">
                {user.username || user.name || '—'}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const user = row.original;
        const searchValue = value.toLowerCase();
        return (
          user.username?.toLowerCase().includes(searchValue) ||
          user.name?.toLowerCase().includes(searchValue) ||
          user.email.toLowerCase().includes(searchValue)
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'secondary';

        if (role?.toLowerCase() === 'admin') variant = 'default';
        if (role?.toLowerCase() === 'petugas') variant = 'outline';

        return <Badge variant={variant}>{role || '—'}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                Aksi untuk {user.username || user.email}
              </DropdownMenuLabel>
              
              <DropdownMenuItem
                onSelect={() => {
                  setSelectedUser(user);
                  setDetailOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleCopyEmail(user.email)}>
                <Copy className="mr-2 h-4 w-4" />
                Copy email
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => {
                  setSelectedUser(user);
                  setEditOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit profil
              </DropdownMenuItem>

              <DropdownMenuItem disabled>
                <KeyRound className="mr-2 h-4 w-4" />
                Reset password
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => {
                  setSelectedUser(user);
                  setDeleteOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus user
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
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari user (nama, email)..."
              value={(table.getColumn('profile')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('profile')?.setFilterValue(event.target.value)
              }
              className="pl-9"
            />
          </div>
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
                      : 'Belum ada data user'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <UserDetailDialog
        userId={selectedUser?.id || null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <EditUserDialog
        user={selectedUser}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleUpdateSuccess}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}