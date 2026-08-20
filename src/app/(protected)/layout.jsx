"use client";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { useIdleTimeout } from "@/hooks/useIdleTimeout";
import { IdleWarningDialog } from "@/components";

// Dynamically import components that use Radix UI to disable SSR
const SidebarProvider = dynamic(() => import("@/components/ui/sidebar").then(mod => mod.SidebarProvider), { ssr: false });
const SidebarTrigger = dynamic(() => import("@/components/ui/sidebar").then(mod => mod.SidebarTrigger), { ssr: false });
const AppSidebar = dynamic(() => import("../../components/customs/app-sidebar.jsx").then(mod => mod.AppSidebar), { ssr: false });
const AppHeader = dynamic(() => import("../../components/customs/app-header.jsx").then(mod => mod.AppHeader), { ssr: false });

export default function ScreensLayout({ children }) {
  const { showWarning, handleStayLoggedIn, handleLogoutNow } =
    useIdleTimeout(5);

  return (
    <div className="h-screen flex flex-row">
      {/* Sidebar - full height left side */}
      <SidebarProvider className="!min-h-0 flex-none">
        <AppSidebar />

        {/* Right side: Header + Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header - right side only (desktop) */}
          <AppHeader />

          {/* Content */}
          <main className="flex-1 overflow-hidden">
            {/* Desktop */}
            <div className="hidden md:flex md:flex-col h-full overflow-auto rounded-tl-4xl bg-[#fdfdfd] p-4 pt-0">
              <div className="flex-1 min-h-0">{children}</div>
            </div>

            {/* Mobile */}
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
        </div>
      </SidebarProvider>

      {/* Idle Warning Dialog */}
      <IdleWarningDialog
        isOpen={showWarning}
        onStayLoggedIn={handleStayLoggedIn}
        onLogoutNow={handleLogoutNow}
        countdown={30}
      />
    </div>
  );
}
