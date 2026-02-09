"use client";

import { useState, useEffect } from "react";
import { ProfileHeader } from "@/components/sections/profile-header";
import { SidebarProfile } from "@/components/navigation/sidebar-profile";
import { ProfileForm } from "@/components/form/profile-form";
import { PassengerList } from "@/components/layout/passenger-list";
import { DeleteAccountSection } from "@/components/content/delete-account";
import { ProfileSkeleton } from "@/components/ui/profile-skeleton";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi loading (ganti dengan real fetch nanti)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1.2 detik untuk demo, sesuaikan dengan kebutuhan

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ProfileHeader />

      <div className="max-w-6xl container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <aside className="md:col-span-3">
            <SidebarProfile />
          </aside>

          <main className="md:col-span-9 space-y-10">
            <section className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
              <ProfileForm />
            </section>

            <section className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
              <PassengerList />
            </section>

            <DeleteAccountSection />
          </main>
        </div>
      </div>
    </div>
  );
}