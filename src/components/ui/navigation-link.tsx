"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";

interface NavigationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

/**
 * Custom Link component that emits navigation events for loading indicators
 */
const NavigationLink = forwardRef<HTMLAnchorElement, NavigationLinkProps>(
  ({ href, onClick, prefetch, replace, scroll, ...props }, ref) => {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Don't override if ctrl/cmd key is pressed (new tab behavior)
      if (e.ctrlKey || e.metaKey) {
        if (onClick) onClick(e);
        return;
      }

      e.preventDefault();

      // Dispatch navigation start event
      window.dispatchEvent(new CustomEvent("navigationStart"));

      // Call the original onClick if it exists
      if (onClick) onClick(e);

      // Navigate programmatically to trigger navigation event
      router.push(href);

      // Dispatch navigation end event when completed
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("navigationEnd"));
      }, 300); // Short delay for immediate transitions
    };

    return (
      <Link
        href={href}
        onClick={handleClick}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        ref={ref}
        {...props}
      />
    );
  }
);

NavigationLink.displayName = "NavigationLink";

export { NavigationLink };
