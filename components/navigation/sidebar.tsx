"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { useEffect } from "react";

import {
  Home,
  Calendar,
  Inbox,
  Settings,
  Users,
  User,
  UserCog,
  Train,
  LayoutGrid,
  Armchair,
  Clock,
  Ticket,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/features/users/useCurrentUser"; // sesuaikan path
import { getPhotoUrl } from "@/lib/fetcher";

interface SidebarProps {
  isOpen: boolean;
}

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/"; // atau gunakan router.push
};

export function Sidebar({ isOpen }: SidebarProps) {
  const { user, isLoading } = useCurrentUser();

  // Fallback kalau belum load atau belum login
  const displayName = user?.name ?? "Guest";
  const displayEmail = user?.email ?? "—";
  const avatarSrc = user?.profile_photo
    ? getPhotoUrl(user.profile_photo)
    : "/default-avatar.png";
  const safeDisplayName = displayName ?? "User";

  const getInitials = (name?: string): string => {
    if (!name || name.trim() === "") return "U";

    const trimmed = name.trim();
    const parts = trimmed.split(/\s+/); // handle banyak spasi

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return trimmed.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name);

  type MenuItem = {
    href: Route;
    label: string;
    icon: any;
  };

  type MenuGroup = {
    groupLabel?: string; // Label grup opsional (Platform, Management, dll)
    items: readonly (
      | {
          label: string;
          icon: any;
          subItems: readonly MenuItem[];
        }
      | {
          label: string;
          icon: any;
          href: Route;
          subItems?: never;
        }
    )[];
  };

  // Struktur baru dengan groupLabel terpisah
  const menuGroups: readonly MenuGroup[] = [
    {
      groupLabel: "Management",
      items: [
        {
          label: "User Management",
          icon: Users,
          subItems: [
            {
              href: "/dashboard/users" as Route<string>,
              label: "Users",
              icon: Users,
            },
            // {
            //   href: "/dashboard/passengers" as Route<string>,
            //   label: "Passengers",
            //   icon: User,
            // },
            // {
            //   href: "/dashboard/staff" as Route<string>,
            //   label: "Staff",
            //   icon: UserCog,
            // },
          ],
        },
      ],
    },
    {
      groupLabel: "Operations",
      items: [
        {
          label: "Operational Data",
          icon: LayoutGrid,
          subItems: [
            {
              href: "/dashboard/kereta" as Route<string>,
              label: "Trains",
              icon: Train,
            },
            {
              href: "/dashboard/carriages" as Route<string>,
              label: "Carriages",
              icon: LayoutGrid,
            },
            {
              href: "/dashboard/seat" as Route<string>,
              label: "Seats",
              icon: Armchair,
            },
            {
              href: "/dashboard/schedules" as Route<string>,
              label: "Schedules",
              icon: Clock,
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Transactions",
      items: [
        {
          label: "Booking Process",
          icon: Ticket,
          subItems: [
            {
              href: "/dashboard/bookings" as Route<string>,
              label: "Bookings",
              icon: Calendar,
            },
            {
              href: "/dashboard/tickets" as Route<string>,
              label: "Tickets",
              icon: Ticket,
            },
            {
              href: "/dashboard/payments" as Route<string>,
              label: "Payments",
              icon: Inbox,
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Other",
      items: [
        {
          label: "Settings",
          icon: Settings,
          href: "/dashboard/settings" as Route<string>,
        },
      ],
    },
  ];

  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label],
    );
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "bg-gray-50 border-r flex flex-col transition-all duration-300 h-screen sticky top-0 overflow-hidden",
          isOpen ? "w-60" : "w-14",
        )}
      >
        {/* Logo */}
        <div className="p-2.5 border-b flex items-center justify-center">
          <Link
            href="/dashboard"
            className="transition-transform hover:scale-105 active:scale-95"
          >
            {isOpen ? (
              <Image
                src="/src/Senro-malam.png"
                alt="Logo"
                width={100}
                height={100}
                className="rounded-md"
                priority
              />
            ) : (
              <Image
                src="/src/Senro-malam.png"
                alt="Logo Mini"
                width={32}
                height={32}
                className="rounded-md"
                priority
              />
            )}
          </Link>
        </div>

        {/* Menu */}
        <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
          {menuGroups.map((menuGroup, groupIndex) => (
            <div
              key={menuGroup.groupLabel || `group-${groupIndex}`}
              className="space-y-2"
            >
              {/* Group Label - hanya tampil saat sidebar terbuka */}
              {isOpen && menuGroup.groupLabel && (
                <div className="px-2 pt-2 pb-1">
                  <span className="text-xs font-semibold text-gray-500">
                    {menuGroup.groupLabel}
                  </span>
                </div>
              )}

              {/* Menu Items */}
              {menuGroup.items.map((item) => {
                const hasSubItems = (item.subItems?.length ?? 0) > 0;
                const ItemIcon = item.icon;

                // Jika tidak punya subItems dan punya href, render sebagai Link langsung
                if (!hasSubItems && "href" in item) {
                  return (
                    <div key={item.label}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 transition-colors w-full text-left",
                              !isOpen && "justify-center px-3",
                            )}
                          >
                            <ItemIcon
                              size={18}
                              className="shrink-0 text-muted-foreground"
                            />
                            {isOpen && (
                              <span className="text-sm font-medium">
                                {item.label}
                              </span>
                            )}
                          </Link>
                        </TooltipTrigger>

                        {!isOpen && (
                          <TooltipContent side="right" className="font-medium">
                            {item.label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                  );
                }

                // Render collapsible untuk item yang punya subItems
                return (
                  <div key={item.label}>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Collapsible
                          open={openGroups.includes(item.label) || !hasSubItems}
                          onOpenChange={() =>
                            hasSubItems && toggleGroup(item.label)
                          }
                          disabled={!hasSubItems || !isOpen}
                        >
                          <CollapsibleTrigger asChild>
                            <button
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 transition-colors w-full text-left",
                                !isOpen && "justify-center px-3",
                              )}
                            >
                              <ItemIcon
                                size={16}
                                className="shrink-0 text-muted-foreground"
                              />
                              {isOpen && (
                                <div className="flex items-center justify-between flex-1">
                                  <span className="text-sm font-medium">
                                    {item.label}
                                  </span>
                                  {hasSubItems && (
                                    <ChevronDown
                                      size={14}
                                      className={cn(
                                        "transition-transform",
                                        openGroups.includes(item.label) &&
                                          "rotate-180",
                                      )}
                                    />
                                  )}
                                </div>
                              )}
                            </button>
                          </CollapsibleTrigger>

                          {isOpen && hasSubItems && (
                            <CollapsibleContent>
                              <div className="relative ml-6 pl-4 border-l border-gray-300/70 space-y-1 pt-1 pb-2">
                                {item.subItems?.map((sub) => {
                                  const SubIcon = sub.icon || Home;
                                  return (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      className="flex items-center gap-3 p-1.5 rounded-md hover:bg-gray-200/80 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      <SubIcon size={16} className="shrink-0" />
                                      <span>{sub.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            </CollapsibleContent>
                          )}
                        </Collapsible>
                      </TooltipTrigger>

                      {!isOpen && (
                        <TooltipContent side="right" className="font-medium">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Bottom */}
        <div className="border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div
                className={cn(
                  "flex items-center cursor-pointer hover:bg-gray-200 rounded-md p-2 transition-colors",
                  !isOpen && "justify-center",
                )}
              >
                <Avatar className="h-8 w-8 rounded-lg shrink-0">
                  <AvatarImage src={avatarSrc} alt={safeDisplayName} />
                  <AvatarFallback>
                    {safeDisplayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {isOpen && (
                  <div className="ml-3 flex flex-col text-left min-w-0">
                    <span className="text-sm font-semibold truncate">
                      {isLoading ? "Memuat..." : displayName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {isLoading ? "—" : displayEmail}
                    </span>
                  </div>
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Notifications</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  );
}
