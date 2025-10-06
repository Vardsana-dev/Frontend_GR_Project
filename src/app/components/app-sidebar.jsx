"use client";

import {
  LayoutDashboard,
  BookAudio,
  User2,
  ChevronUp,
  ChevronRight,
  LogOut,
  BookOpen,
  Package
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cscLogo from "../../../public/csc-items/1757302046465.png"

const items = [
  {
    title: "ໜ້າຫຼັກ",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   title: "ສັ່ງຊື້ທັງໝົດ",
  //   url: "/all-po",
  //   icon: BookOpen,
  // },
  {
    title: "ສິນຄ້າ",
    url: "/all-products",
    icon: Package,
  },
  {
    title: "ສັ່ງຊື້",
    url: "/all-pr",
    icon: Package,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  // Get username from user data
  const username = user?.user?.USERNAME || user?.user?.username || 'ຜູ້ໃຊ້';
  const handleLogout = () => {
    // console.log('🚪 Logging out...');
    logout();
  };

  const handleAccountClick = () => {
    // console.log('👤 Opening user account page...');
    router.push('/user');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-start justify-between">
          {state === "collapsed" ? (
            <SidebarTrigger className="mb-1 ml-[2.5px]" />
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Image 
                src={cscLogo}
                alt="CSC Report" 
                width={70} 
                height={70}
                className="object-contain"
                priority
              />
            </div>
          )}
          {state !== "collapsed" && <SidebarTrigger />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // Check if any submenu is active
                const isSubMenuActive = item.items?.some(subItem => pathname === subItem.url);

                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={isSubMenuActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      {item.items ? (
                        <>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              <item.icon />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : (
                        <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />
                  <span className="truncate">{username}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] min-w-56"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={handleAccountClick} className="text-gray-500">
                  <User2 />
                  <span>ບັນຊີ</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-gray-500">
                  <LogOut />
                  <span>ອອກຈາກລະບົບ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}