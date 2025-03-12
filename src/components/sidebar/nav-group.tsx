"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  NavCollapsible,
  NavItem,
  NavLink,
  NavGroup as NavGroupType,
} from "./types";

export function NavGroup({ title, items }: NavGroupType) {
  const { state } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-gray-400 uppercase text-xs font-semibold">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item: NavItem) => {
          const key = `${item.title}-${item.url}`;

          if (!item.items)
            return (
              <SidebarMenuLink key={key} item={item} pathname={pathname} />
            );

          if (state === "collapsed")
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item}
                pathname={pathname}
              />
            );

          return (
            <SidebarMenuCollapsible key={key} item={item} pathname={pathname} />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className="rounded-full px-1 py-0 text-xs bg-gray-700 text-white">
    {children}
  </Badge>
);

function isNavLink(item: NavItem): item is NavLink {
  return "url" in item;
}

const SidebarMenuLink = ({
  item,
  pathname,
}: {
  item: NavLink;
  pathname: string;
}) => {
  const { setOpenMobile } = useSidebar();
  const isActive = checkIsActive(pathname, item);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={
          isActive
            ? "bg-gray-800 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }
      >
        <Link href={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && (
            <item.icon className={isActive ? "text-white" : "text-gray-400"} />
          )}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({
  item,
  pathname,
}: {
  item: NavCollapsible;
  pathname: string;
}) => {
  const { setOpenMobile } = useSidebar();
  const isActive = checkIsActive(pathname, item, true);

  return (
    <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            className={
              isActive
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }
          >
            {item.icon && (
              <item.icon
                className={isActive ? "text-white" : "text-gray-400"}
              />
            )}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-gray-400" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem: NavItem) => {
              if (isNavLink(subItem)) {
                const isSubActive = checkIsActive(pathname, subItem);
                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={isSubActive}
                      className={
                        isSubActive
                          ? "text-white"
                          : "text-gray-300 hover:text-white"
                      }
                    >
                      <Link
                        href={subItem.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        {subItem.icon && (
                          <subItem.icon
                            className={
                              isSubActive ? "text-white" : "text-gray-400"
                            }
                          />
                        )}
                        <span>{subItem.title}</span>
                        {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              }
              return null;
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({
  item,
  pathname,
}: {
  item: NavCollapsible;
  pathname: string;
}) => {
  const isActive = checkIsActive(pathname, item);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isActive}
            className={
              isActive
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }
          >
            {item.icon && (
              <item.icon
                className={isActive ? "text-white" : "text-gray-400"}
              />
            )}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-gray-400" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ""}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub: NavItem) => {
            if (isNavLink(sub)) {
              const isSubActive = checkIsActive(pathname, sub);
              return (
                <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                  <Link
                    href={sub.url}
                    className={`${isSubActive ? "bg-secondary" : ""}`}
                  >
                    {sub.icon && (
                      <sub.icon className={isSubActive ? "text-primary" : ""} />
                    )}
                    <span className="max-w-52 text-wrap">{sub.title}</span>
                    {sub.badge && (
                      <span className="ml-auto text-xs">{sub.badge}</span>
                    )}
                  </Link>
                </DropdownMenuItem>
              );
            }
            return null;
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

function checkIsActive(pathname: string, item: NavItem, mainNav = false) {
  return (
    pathname === item.url || // /endpoint
    !!item?.items?.filter((i: NavItem) => i.url === pathname).length || // if child nav is active
    (mainNav &&
      pathname.split("/")[1] !== "" &&
      pathname.split("/")[1] === item?.url?.split("/")[1])
  );
}
