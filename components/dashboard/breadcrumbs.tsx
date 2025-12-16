"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DASHBOARD_BREADCRUMBS } from "@/data/breadcrumbs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function Breadcrumbs() {
  const pathname = usePathname();
  let crumbs = DASHBOARD_BREADCRUMBS[pathname];

  if (!crumbs) {
    const entry = Object.entries(DASHBOARD_BREADCRUMBS).find(([key]) => {
      if (key.endsWith("/[id]")) {
        const base = key.slice(0, -5);
        return (
          pathname.startsWith(base + "/") &&
          pathname.slice(base.length + 1).split("/").length === 1
        );
      }
      return false;
    });

    if (entry) {
      const [, items] = entry;
      const id = pathname.split("/").pop();
      crumbs = items.map((item) => ({
        ...item,
        href: item.href.replace("[id]", id!),
      }));
    }
  }

  if (!crumbs) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <React.Fragment key={crumb.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
