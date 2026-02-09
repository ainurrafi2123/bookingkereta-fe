// components/users/user-detail-dialog.tsx
"use client";

import { useUserDetail } from "@/features/users/useUsersDetail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface UserDetailDialogProps {
  userId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({
  userId,
  open,
  onOpenChange,
}: UserDetailDialogProps) {
  const { user, loading, error } = useUserDetail(userId); // ← Fetch detail saat modal buka

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail User</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : user ? (
          <div className="space-y-6">
            {/* Informasi Dasar */}
            <div>
              <h3 className="font-semibold mb-3">Informasi Dasar</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Username:</dt>
                <dd className="font-medium">{user.username || "—"}</dd>

                <dt className="text-muted-foreground">Email:</dt>
                <dd className="font-medium">{user.email}</dd>

                <dt className="text-muted-foreground">Role:</dt>
                <dd className="font-medium capitalize">{user.role}</dd>
              </dl>
            </div>

            {/* Detail Penumpang */}
            {user.role === "penumpang" && user.penumpang && (
              <div>
                <h3 className="font-semibold mb-3">Detail Penumpang</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">NIK:</dt>
                  <dd className="font-medium">{user.penumpang.nik || "—"}</dd>

                  <dt className="text-muted-foreground">Nama Lengkap:</dt>
                  <dd className="font-medium">
                    {user.penumpang.nama_penumpang || "—"}
                  </dd>

                  <dt className="text-muted-foreground">Alamat:</dt>
                  <dd className="font-medium">
                    {user.penumpang.alamat || "—"}
                  </dd>

                  <dt className="text-muted-foreground">No. HP:</dt>
                  <dd className="font-medium">{user.penumpang.no_hp || "—"}</dd>
                </dl>
              </div>
            )}

            {/* Detail Petugas */}
            {user.role === "petugas" && user.petugas && (
              <div>
                <h3 className="font-semibold mb-3">Detail Petugas</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">NIK:</dt>
                  <dd className="font-medium">{user.petugas.nik || "—"}</dd>

                  <dt className="text-muted-foreground">Nama Lengkap:</dt>
                  <dd className="font-medium">
                    {user.petugas.nama_petugas || "—"}
                  </dd>

                  <dt className="text-muted-foreground">Alamat:</dt>
                  <dd className="font-medium">{user.petugas.alamat}</dd>

                  <dt className="text-muted-foreground">No. HP:</dt>
                  <dd className="font-medium">{user.petugas.no_hp}</dd>
                </dl>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
