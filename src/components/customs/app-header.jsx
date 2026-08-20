"use client";

import React from "react";
import { Mail, User2, User, Info, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation"

export function AppHeader() {
  const { user } = useAuth();
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
    <header className="hidden md:flex items-center justify-between bg-white pr-6 pl-4 h-(--header-height) shrink-0 mb-4 border-b-1 border-gray-300">
      {/* Left - Active page title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        {activeTitle || ""}
      </h1>

      {/* Right - Notifications + User */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <div onClick={() => router.push('/chats')} className="relative cursor-pointer">
          <Mail className="w-6 h-6" />
        </div >

        <div className="border-r-1 border-gray-300 h-7"></div>

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
                className="text-red-500 focus:text-red-800"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-1 text-red-500" />
                ອອກຈາກລະບົບ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
