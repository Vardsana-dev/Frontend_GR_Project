"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import Image from "next/image";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";
import { IdleWarningDialog } from "@/components";

export default function ScreensLayout({ children }) {
  const { showWarning, handleStayLoggedIn, handleLogoutNow } =
    useIdleTimeout(5);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="hidden md:block h-full overflow-auto p-4">
          <div className="max-w-full">{children}</div>
        </div>

        <div className="md:hidden h-full overflow-auto">
          <div className="flex justify-between items-center bg-[#00C3FF] border shadow-xs mb-4">
            <SidebarTrigger className="sidebar-trigger-custom ml-3" />
            <Image
              src="/csc-items/1757302046465.png"
              className="m-2"
              alt="CSC Product Order"
              width={50}
              height={50}
            />
          </div>
          <div className="m-2 max-w-full">{children}</div>
        </div>
      </main>

      {/* Idle Warning Dialog */}
      <IdleWarningDialog
        isOpen={showWarning}
        onStayLoggedIn={handleStayLoggedIn}
        onLogoutNow={handleLogoutNow}
        countdown={30}
      />
    </SidebarProvider>
  );
}
