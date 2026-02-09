// app/dashboard/users/page.tsx
"use client";

import { useState } from "react";
import { useUsers } from "@/features/users/useUsers";
import { UserDataTable } from "@/components/layout/users-data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const { users, loading, error, refetch } = useUsers(); // ← Tambahkan refetch
  const [roleFilter, setRoleFilter] = useState<"all" | "petugas" | "penumpang">(
    "all",
  );

  const filteredUsers = users.filter((user) => {
    if (roleFilter === "all") return true;
    return user.role === roleFilter;
  });

  const petugasCount = users.filter((u) => u.role === "petugas").length;
  const penumpangCount = users.filter((u) => u.role === "penumpang").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <User className="h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">
              Pengelolaan Users
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Kelola semua pengguna sistem
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
          <Tabs
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value as any)}
          >
            <TabsList>
              <TabsTrigger value="all">Semua User ({users.length})</TabsTrigger>
              <TabsTrigger value="petugas">
                Petugas ({petugasCount})
              </TabsTrigger>
              <TabsTrigger value="penumpang">
                Penumpang ({penumpangCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <UserDataTable data={filteredUsers} onRefresh={refetch} />
        </>
      )}
    </div>
  );
}
