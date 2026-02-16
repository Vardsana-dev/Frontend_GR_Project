"use client";

import React from "react";
import { Mail, User2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { items } from "./app-sidebar";

export function AppHeader() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const username = user?.user?.USERNAME || user?.user?.username || "ຜູ້ໃຊ້";
  const role = user?.user?.ROLE || user?.user?.role || "User";

  const activeTitle = items.reduce((found, item) => {
    if (found) return found;
    if (item.url === pathname) return item.title;
    const sub = item.items?.find((s) => s.url === pathname);
    return sub ? sub.title : null;
  }, null);

  return (
    <header className="hidden md:flex items-center justify-between bg-white pr-6 pl-4 h-(--header-height) shrink-0">
      {/* Left - Active page title */}
      <h1 className="text-2xl font-semibold text-gray-800">
        {activeTitle || ""}
      </h1>

      {/* Right - Notifications + User */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <div className="relative cursor-pointer">
          <Mail className="w-7 h-7" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            6
          </span>
        </div>

        <div className="border-r-1 border-gray-300 h-7"></div>

        {/* User */}
        {isClient && (
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-semibold">@{username}</p>
              <p className="text-xs text-blue-700">{role}</p>
            </div>

            <div className="border-r-1 border-gray-300 h-7"></div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-200">
              <User2 className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
