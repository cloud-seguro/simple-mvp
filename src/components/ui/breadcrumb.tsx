"use client";

import * as React from "react";
import { ChevronRight, MoreHorizontal, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    name: string;
    href: string;
  }[];
  separator?: React.ReactNode;
  homeHref?: string;
  truncate?: number;
}

export function Breadcrumb({
  segments,
  separator = <ChevronRight className="h-4 w-4" />,
  homeHref = "/",
  truncate,
  className,
  ...props
}: BreadcrumbProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [visibleSegments, setVisibleSegments] = React.useState(segments);

  React.useEffect(() => {
    if (isMobile && truncate && segments.length > truncate) {
      const start = segments.slice(0, 1);
      const end = segments.slice(-truncate);
      setVisibleSegments([...start, ...end]);
    } else {
      setVisibleSegments(segments);
    }
  }, [segments, truncate, isMobile]);

  const showTruncationIndicator =
    isMobile && truncate && segments.length > truncate;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm", className)}
      {...props}
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li className="flex items-center">
          <Link
            href={homeHref}
            className="flex items-center hover:text-foreground text-muted-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {visibleSegments.map((segment, index) => (
          <React.Fragment key={segment.href}>
            {index === 0 && showTruncationIndicator ? (
              <>
                <li className="flex items-center">
                  <span className="text-muted-foreground">{separator}</span>
                </li>
                <li className="flex items-center">
                  <span className="text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                </li>
              </>
            ) : index !== 0 ? (
              <li className="flex items-center">
                <span className="text-muted-foreground">{separator}</span>
              </li>
            ) : null}
            <li>
              <Link
                href={segment.href}
                className={cn(
                  "hover:text-foreground transition-colors",
                  index === visibleSegments.length - 1
                    ? "text-foreground font-medium pointer-events-none"
                    : "text-muted-foreground"
                )}
                aria-current={
                  index === visibleSegments.length - 1 ? "page" : undefined
                }
              >
                <span className="truncate max-w-[100px] sm:max-w-none inline-block">
                  {segment.name}
                </span>
              </Link>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
