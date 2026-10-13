// @ts-nocheck
"use client";

import React from "react";
import {
  House,
  ChevronRight,
  MessageSquareCode,
  Settings,
  ScrollText,
  ClipboardClock,
  MessageCircleMore,
  Search,
  Package,
  User,
  ListChecks
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
    title: "ຄົ້ນຫາ",
    icon: Search,
    url: "/search_po",
    items: [
      { title: "ຄົ້ນຫາ PO", url: "/search_po" },
      { title: "ຄົ້ນຫາສິນຄ້າ", url: "/search_product" },
    ],
  },
  {
    title: "ຮັບສິນຄ້າ",
    url: "/goods_receipt",
    icon: Package,
  },
  {
    title: "ປະຫວັດການຮັບສິນຄ້າ",
    url: "/goods_receipt_history",
    icon: ClipboardClock,
  },
  {
    title: "ລາຍງານການຮັບສິນຄ້າ",
    url: "/goods_receipt_report",
    icon: ListChecks,
  },
  // {
  //   title: "ຈັດການຜູ້ໃຊ້",
  //   icon: User,
  //   url: "/user",
  //   items: [
  //     { title: "ຜູ້ໃຊ້", url: "/user" },
  //   ],
  //   // items: [
  //   //   { title: "ລຳດັບຜູ້ຢືນຢັນ", url: "/approver-sequence" },
  //   // ],
  // },
  // {
  //   title: "ລາຍງານ",
  //   icon: ScrollText,
  //   items: [
  //     { title: "ລາຍງານການຮ້ອງຂໍ", url: "/requests-reports" },
  //   ],
  // },
  {
    title: "ຕັ້ງຄ່າ",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r-1 border-gray-300 print:hidden">
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
