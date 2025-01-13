"use client";
import { useContext } from "react";
import { items } from "./SidebarItems";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import SearchContext from "@/contexts/SearchContext";
import { AppContext } from "@/contexts/AppContext";
import Link from "next/link";

export default function SidebarComponent() {
  const { activeItem, setActiveItem } = useContext(AppContext);
  const { setSearchType } = useContext(SearchContext);
  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <Image
            src={`/assets/logo.png`}
            alt="Logo"
            width={288}
            height={72}
            className="mb-7"
          />

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-3">
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      onClick={() => {
                        setActiveItem(item.title);
                        setSearchType(item.title);
                      }}
                      className={`flex items-center space-x-2 p-3 rounded-md transition-colors duration-200 ${
                        activeItem === item.title
                          ? "bg-orange-400 text-white"
                          : "text-gray-700 hover:bg-orange-300"
                      }`}
                    >
                      <item.icon className="text-xl" />
                      <span className="text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}