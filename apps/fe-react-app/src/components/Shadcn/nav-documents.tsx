"use client";

import { type Icon } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom"; // Thêm useLocation

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/Shadcn/ui/sidebar";

export function NavDocuments({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: Icon;
  }[];
}) {
  const { isMobile } = useSidebar();
  // Lấy location hiện tại
  const location = useLocation();

  // Hàm kiểm tra mục có đang được chọn không
  const isActive = (itemUrl: string) => {
    // Loại bỏ trailing slash nếu có
    const currentPath = location.pathname.endsWith("/") ? location.pathname.slice(0, -1) : location.pathname;
    const url = itemUrl.endsWith("/") ? itemUrl.slice(0, -1) : itemUrl;

    // Kiểm tra nếu đường dẫn hiện tại chính xác là URL của mục
    if (currentPath === url) return true;

    // Kiểm tra nếu đường dẫn hiện tại bắt đầu bằng URL của mục và ký tự tiếp theo là '/'
    if (currentPath.startsWith(url) && (currentPath.length === url.length || currentPath[url.length] === "/")) {
      return true;
    }

    return false;
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>User Management</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              // Thêm các class khi mục đang active
              className={
                isActive(item.url)
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  : ""
              }
            >
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
