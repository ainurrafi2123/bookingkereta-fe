// components/profile-header.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Ticket } from "lucide-react";
import { Route } from "next";

interface UserData {
  name: string;
  email: string;
  role?: string;
  profile_photo?: string | null;
}

const API_BASE_URL = "http://127.0.0.1:8000";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProfileHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isHistoryPath = pathname.includes("/history");
  const isPetugas = userData?.role === 'petugas';
  const headerTitle = isHistoryPath 
    ? "Riwayat Pemesanan" 
    : (isPetugas ? "Detail Petugas" : "Detail Penumpang");

  useEffect(() => {
    const loadUser = () => {
      setIsLoading(true);
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user: UserData = JSON.parse(userStr);
          if (user.name && user.email) {
            setUserData(user);
          } else {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            router.push("/login");
          }
        } catch (err) {
          console.error("Gagal parse user data:", err);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserData(null);
    router.push("/login");
  };



  if (!userData) {
    return null;
  }

  return (
    <div
      className="relative h-[41vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/src/kereta.jpg')" }}
    >
      <div className="relative max-w-6xl container mx-auto px-4">
        {/* Navbar - dengan padding top untuk jeda dari atas */}
        <div className="flex items-center justify-between h-20 pt-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/src/Senro-malam.png"
              alt="Senro Logo"
              width={120}
              height={40}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none flex items-center gap-3 hover:opacity-90 transition">
                {/* Nama user di sebelah kanan avatar */}
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="font-medium text-white text-sm leading-tight">
                    {userData.name}
                  </span>
                </div>
                {/* Avatar */}
                <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-white/50 ring-offset-1 ring-offset-blue-700">
                  <AvatarImage
                    src={
                      userData.profile_photo
                        ? `${API_BASE_URL}/storage/${userData.profile_photo}`
                        : undefined
                    }
                    alt={userData.name}
                  />
                  <AvatarFallback className="bg-linear-to-br from-blue-500 to-blue-600 text-white">
                    {getInitials(userData.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{userData.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {userData.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={"/account/profile" as Route}>
                  <User className="mr-2 h-4 w-4" />
                  {headerTitle}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={"/history" as Route}>
                  <Ticket className="mr-2 h-4 w-4" />
                  Pemesanan Anda
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Header Content */}
        <div className="py-12 md:py-16">
          <h1 className="text-3xl text-white md:text-4xl font-bold mb-3 drop-shadow-lg">
            {headerTitle}
          </h1>
        </div>
      </div>
    </div>
  );
}
