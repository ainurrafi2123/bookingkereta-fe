import { cn } from "@/lib/utils";
import Link from "next/link";
import { User, Ticket, Bell, CreditCard } from "lucide-react";

const menuItems: Array<{
  icon: typeof User;
  label: string;
  href: string;
  active?: boolean;
}> = [
  {
    icon: User,
    label: "Detail penumpang",
    href: "/account/profile",
    active: true,
  },
  {
    icon: Ticket,
    label: "Pemesanan Anda",
    href: "/account/bookings",
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
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href} // sekarang aman karena href unik
            href={item.href as any}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              item.active
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}