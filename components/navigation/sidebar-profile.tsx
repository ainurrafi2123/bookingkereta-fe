import { cn } from "@/lib/utils";
import Link from "next/link";
import { User, Ticket, Bell, CreditCard } from "lucide-react";
import { useProfile } from "@/features/profile/useProfile";

const menuItems: Array<{
  icon: typeof User;
  label: string;
  href: string;
  active?: boolean;
}> = [
  {
    icon: User,
    label: "Detail Profile", // Placeholder, will be replaced in render
    href: "/account/profile",
    active: true,
  },
  {
    icon: Ticket,
    label: "Pemesanan Anda",
    href: "/history",
  },
  {
    icon: CreditCard,
    label: "Metode pembayaran",
    href: "/account/payments",
  },
  {
    icon: Bell,
    label: "Notifikasi",
    href: "/account/notifications",
  },
];

export function SidebarProfile() {
  const { profile } = useProfile();
  const isPetugas = profile?.role === 'petugas';

  const visibleMenuItems = menuItems.filter((item) => {
    if (isPetugas && item.label === "Pemesanan Anda") return false;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
      <nav className="space-y-1">
        {visibleMenuItems.map((item) => {
           let label = item.label;
           if (item.href === "/account/profile") {
             label = isPetugas ? "Detail petugas" : "Detail penumpang";
           }

          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                item.active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
              )}
            >
              <item.icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}