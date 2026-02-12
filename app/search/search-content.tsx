// app/search/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchForm } from '@/components/form/search-form';
import { ScheduleResults } from '@/components/content/schedules-result';
import { Skeleton } from '@/components/ui/skeleton';

const NavBarUser = dynamic(
  () => import('@/components/navigation/nav-user'),
  {
    ssr: false,
    loading: () => <div className="h-16 bg-white border-b" />,
  }
);

function SearchPageContent() {
  const searchParams = useSearchParams();
  
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const adults = parseInt(searchParams.get('adults') || '1');
  const elderly = parseInt(searchParams.get('elderly') || '0');
  const youth = parseInt(searchParams.get('youth') || '0');

  return (
    <div className="min-h-screen bg-blue-50">
      <NavBarUser />
      <div className="">
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Compact Search Form */}
        <SearchForm />

        {/* Results */}
        <ScheduleResults 
          searchParams={{ from, to, date, adults, elderly, youth }} 
        />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Skeleton className="h-screen" />}>
      <SearchPageContent />
    </Suspense>
  );
}