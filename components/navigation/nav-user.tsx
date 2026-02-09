"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner"; // Import di bagian atas
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Route } from "next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Ticket, Bell, LogOut } from "lucide-react";

// Tipe data untuk user
interface UserData {
  name: string;
  email: string;
  role?: string;
  profile_photo?: string | null;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const NavUser = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Load user dari localStorage sekali saat mount
  useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user: UserData = JSON.parse(userStr);
          // Validasi minimal (opsional, tapi bagus)
          if (user.email && user.name) {
            setUserData(user);
            setIsLoggedIn(true);
          } else {
            throw new Error("Data user tidak lengkap");
          }
        } catch (err) {
          console.error("Invalid user data in localStorage:", err);
          localStorage.removeItem("user");
          localStorage.removeItem("auth_token"); // bersihkan juga token kalau ada
          setIsLoggedIn(false);
          setUserData(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    loadUser();

    // Optional: listen perubahan storage dari tab lain (misal logout di tab lain)
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await Promise.race([
          fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 3000),
          ),
        ]).catch((err) => console.warn("API logout skip:", err));
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // 1. Bersihkan Data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUserData(null);

      // 2. Tampilkan Toast
      toast.success("Berhasil Keluar", {
        description: "Anda telah keluar dari sistem.",
      });

      // 3. Gunakan router.push daripada window.location.href
      // Jika tetap pakai window.location.href, toast akan hilang seketika.
      router.push("/");
    }
  };

  // Generate initial dari nama untuk avatar fallback
  const getInitials = (name: string | undefined): string => {
    if (!name) return "U";

    const parts = name.split(" ");

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Spacer agar konten tidak tertutup navbar */}
      <div
        className={cn(
          "h-[120px] transition-all duration-700 ease-in-out",
          isScrolled && "h-[72px]",
        )}
      />

      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-700 ease-in-out",
          isScrolled && "shadow-md",
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mode full (awal) */}
          <div
            className={cn(
              "flex flex-col transition-all duration-700 ease-in-out overflow-hidden",
              isScrolled
                ? "max-h-0 opacity-0 pointer-events-none"
                : "max-h-10 opacity-100 py-2",
            )}
          >
            {/* Top bar kecil */}
            <div className="flex justify-end items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition">
                Jadi Partner Senro.com
              </a>
              <a href="#" className="hover:text-blue-600 transition">
                Senro Tiket Rewards
              </a>
              <div className="flex items-center cursor-pointer hover:text-blue-600">
                <img
                  src="https://flagcdn.com/w20/id.png"
                  alt="IDR"
                  className="w-5 h-3 mr-1"
                />
                <span className="font-medium">IDR</span>
              </div>
            </div>
          </div>

          {/* Main bar - berubah jadi compact saat scrolled */}
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - hilang saat scrolled */}
            {!isScrolled && (
              <div className="shrink-0 transition-all duration-700">
                <Link href="/" className="shrink-0 transition-all duration-700">
                  <Image
                    src="/src/Senro-malam.png"
                    alt="Senro Logo"
                    width={120}
                    height={40}
                    priority
                  />
                </Link>
              </div>
            )}

            {/* Search area - menjadi center saat scrolled */}
            <div
              className={cn(
                "flex-1 transition-all duration-700 ease-in-out",
                isScrolled ? "max-w-3xl mx-auto" : "max-w-xl mx-8",
              )}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tiket kereta ke Yogyakarta"
                  className={cn(
                    "w-full px-4 py-3 pl-11 pr-14 text-gray-700 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition",
                    isScrolled && "py-2.5 shadow-sm",
                  )}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {/* Tombol Cari (muncul di dalam search saat compact) */}
                <Button
                  size="sm"
                  className={cn(
                    "absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4",
                    !isScrolled && "hidden md:inline-flex",
                  )}
                >
                  Cari
                </Button>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Menu utama - hanya di mode full */}
              {!isScrolled && isLoggedIn && (
                <div className="hidden md:flex items-center space-x-8 mr-8 transition-opacity duration-700">
                  <a
                    href="#"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Pesan Tiket
                  </a>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Jadwal Kereta
                  </a>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Cek Tiket
                  </a>
                  <a href="#" className="text-blue-600 font-semibold">
                    Bantuan
                  </a>
                </div>
              )}

              {!isScrolled && (
                <>
                  {isLoggedIn && userData ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none">
                          <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-offset-2 ring-blue-100 hover:ring-blue-300 transition">
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

                        <DropdownMenuItem key="profile" asChild>
                          <Link href={"/account/profile" as Route}>
                            <User className="mr-2 h-4 w-4" />
                            Detail Penumpang
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem key="orders">
                          <Ticket className="mr-2 h-4 w-4" />
                          Pemesanan Anda
                        </DropdownMenuItem>

                        <DropdownMenuItem key="notifications">
                          <Bell className="mr-2 h-4 w-4" />
                          Notifikasi
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          key="logout"
                          onClick={handleLogout}
                          className="text-red-600"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Keluar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Link
                        href="/login"
                        className="px-5 py-2 text-blue-600 font-medium hover:text-blue-800 transition"
                      >
                        Masuk
                      </Link>

                      <Link
                        href="/register"
                        className="px-5 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition rounded-lg"
                      >
                        Daftar
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavUser;
