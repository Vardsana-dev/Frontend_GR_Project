import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import Image from "next/image";

export default function ScreensLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full md:m-4">
        <div className="hidden md:block">{children}</div>

        <div className="md:hidden">
          <div className="flex justify-between bg-white border shadow-xs m-2 mb-4 rounded-sm items-center p-2">
            <SidebarTrigger/>
            <Image src="/csc-items/1757302046465.png" alt="CSC Report" width={50} height={50} />
          </div>
          <div className="m-2">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}