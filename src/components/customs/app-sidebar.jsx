"use client";

import React from "react";
import {
  House,
  ChevronRight,
  MessageSquareCode,
  Settings,
  ScrollText,
  ClipboardClock,
  MessageCircleMore
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import cscLogo from "../../../public/csc-items/csc-logo.png";

export const items = [
  {
    title: "ໜ້າຫຼັກ",
    url: "/dashboard",
    icon: House,
  },
  {
    title: "ການຮ້ອງຂໍ",
    url: "/requests",
    icon: MessageSquareCode,
  },
  {
    title: "ແຊັດ",
    url: "/requests",
    icon: MessageCircleMore,
  },
  {
    title: "ປະຫວັດ",
    icon: ClipboardClock,
    items: [
      { title: "ປະຫວັດການຮ້ອງຂໍ", url: "/requests-history" },
    ],
  },
  {
    title: "ລາຍງານ",
    icon: ScrollText,
    items: [
      { title: "ລາຍງານການຮ້ອງຂໍ", url: "/reports-requests" },
    ],
  },
  {
    title: "ຕັ້ງຄ່າ",
    url: "/requests",
    icon: Settings,
  },
  // {
  //   title: "ຕັ້ງຄ່າ",
  //   icon: Settings,
  //   items: [
  //     { title: "ລືມລະຫັດຜ່ານ", url: "/forgot-password" },
  //     { title: "ການຕັ້ງຄ່າບັນຊີ", url: "/account-settings" },
  //     { title: "ການຕັ້ງຄ່າລະບົບ", url: "/system-settings" },
  //   ],
  // },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {/* Row 1: Logo with white background */}
      <SidebarHeader className="bg-white flex items-center justify-center p-4">
        <Image
          src={cscLogo}
          alt="CSC"
          width={90}
          height={90}
          className="object-contain"
        />
      </SidebarHeader>

      {/* Row 2: Menu items */}
      <SidebarContent className={'rounded-tr-4xl bg-sidebar pt-4'}>
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
    </Sidebar>
  );
}