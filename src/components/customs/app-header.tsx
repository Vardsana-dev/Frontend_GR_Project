// @ts-nocheck
"use client";

import React from "react";
import { Mail, User2, User, Info, LogOut, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";
import { usePathname } from "next/navigation";
import { items } from "./app-sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components";
import { useRouter } from "next/navigation"

export function AppHeader() {
  const { user } = useAuth();
  const { logout: handleLogout, loading: isLoggingOut } = useLogout();
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const username = user?.user?.USERNAME || user?.user?.username || "ຜູ້ໃຊ້";

  const activeTitle = items.reduce((found, item) => {
    if (found) return found;
    if (item.url === pathname) return item.title;
    const sub = item.items?.find((s) => s.url === pathname);
    return sub ? sub.title : null;
  }, null);

  return (
    <header className="hidden md:flex items-center justify-between bg-white pr-6 pl-4 h-(--header-height) shrink-0 mb-4 border-b-1 border-gray-300 print:hidden">
      {/* Left - Active page title */}
      <h1 className="text-[32px] font-black text-[#1e3a8a] drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] tracking-wide">
        {activeTitle || ""}
      </h1>

      {/* Right - Notifications + User */}
      <div className="flex items-center gap-6">

        {isClient && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-4 cursor-pointer">
                <div className="text-right">
                  <p className="text-sm font-semibold">{username}</p>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200">
                  <User2 className="w-5 h-5" />
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* <DropdownMenuItem>
                <User className="w-4 h-4 mr-1" />
                ບັນຊີ
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Info className="w-4 h-4 mr-1" />
                ກ່ຽວກັບລະບົບ
              </DropdownMenuItem> */}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-500 focus:text-red-800 cursor-pointer"
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 mr-1 text-red-500 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-1 text-red-500" />
                )}
                {isLoggingOut ? "ກຳລັງອອກ..." : "ອອກຈາກລະບົບ"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
