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
import Image from "next/image";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "ປະກາດສັ່ງຊື້ທັງໝົດ (All PO)",
    url: "/all-po",
    icon: BookOpen,
  },
  {
    title: "ສິນຄ້າທັງໝົດ (All Products)",
    url: "/all-products",
    icon: Package,
  },
  {
    title: "Report",
    icon: BookAudio,
    items: [
      {
        title: "Sales Report",
        url: "/reports/sales",
      },
      {
        title: "Product Report",
        url: "/reports/products",
      },
      {
        title: "Customer Report",
        url: "/reports/customers",
      },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-start justify-between">
          {state === "collapsed" ? (
            <SidebarTrigger className="mb-1 ml-[2.5px]" />
          ) : (
            <Image src="/csc-items/1757302046465.png" alt="CSC Report" width={100} height={100} />
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
                  <span>Username</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] min-w-56"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User2 />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}