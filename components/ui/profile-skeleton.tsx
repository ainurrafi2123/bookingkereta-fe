import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Skeleton */}
      <div className="bg-gray-400 text-white">
        <div className="mx-auto max-w-6xl px-4">
          {/* Navbar baris atas */}
          <div className="h-16 flex items-center justify-between">
            <Skeleton className="h-10 w-32 rounded" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>

          {/* Judul & tagline */}
          <div className="py-12 md:py-16 space-y-4">
            <Skeleton className="h-10 w-3/5 rounded" />
            <Skeleton className="h-6 w-4/5 rounded" />
          </div>
        </div>
      </div>

      {/* Konten utama */}
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar Skeleton */}
          <aside className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-40 rounded" />
                </div>
              ))}
            </div>
          </aside>

          {/* Main content Skeleton */}
          <main className="md:col-span-9 space-y-10">
            {/* Info Dasar Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-40 rounded" />
                <Skeleton className="h-9 w-20 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Penumpang Lain Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-40 rounded" />
                <Skeleton className="h-9 w-28 rounded" />
              </div>
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            {/* Hapus Akun Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 space-y-4">
              <Skeleton className="h-7 w-32 rounded" />
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-5 w-64 rounded" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}