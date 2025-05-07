"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { forwardRef, useEffect } from "react";

interface NavigationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

/**
 * Custom Link component that emits navigation events for loading indicators
 * and provides instant navigation with loading state
 */
const NavigationLink = forwardRef<HTMLAnchorElement, NavigationLinkProps>(
  ({ href, onClick, prefetch = true, replace, scroll, ...props }, ref) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Don't override if ctrl/cmd key is pressed (new tab behavior)
      if (e.ctrlKey || e.metaKey) {
        if (onClick) onClick(e);
        return;
      }

      // If navigating to the same route, don't do anything special
      if (href === pathname) {
        if (onClick) onClick(e);
        return;
      }

      e.preventDefault();

      // Trigger loading state immediately
      window.dispatchEvent(
        new CustomEvent("navigationStart", { detail: { href } })
      );

      // Call the original onClick if it exists
      if (onClick) onClick(e);

      // Start a fade-out animation and navigate immediately
      document.body.setAttribute("data-navigation-active", "true");

      // Navigate after a minimal delay to improve perceived responsiveness
      // by showing visual feedback
      setTimeout(() => {
        router.push(href);
      }, 5);
    };

    // Prefetch the link for instant navigation
    useEffect(() => {
      if (prefetch) {
        router.prefetch(href);
      }
    }, [router, href, prefetch]);

    // Set up a global navigation watcher
    useEffect(() => {
      // This will handle the case where navigation completes
      const handleRouteChangeComplete = () => {
        // Use a small delay to allow rendering to complete before removing transition
        setTimeout(() => {
          document.body.setAttribute("data-navigation-active", "false");
          window.dispatchEvent(new CustomEvent("navigationEnd"));
        }, 50);
      };

      // This will be used for our timeout fallback
      let navigationTimeout: NodeJS.Timeout;

      // Set up event listener for Next.js navigation start
      const handleNavigationStart = () => {
        // Clear any existing timeout
        if (navigationTimeout) clearTimeout(navigationTimeout);

        // Set a fallback timeout to ensure we don't get stuck in loading state
        navigationTimeout = setTimeout(() => {
          document.body.setAttribute("data-navigation-active", "false");
          window.dispatchEvent(new CustomEvent("navigationEnd"));
        }, 3000); // Maximum 3 seconds for navigation
      };

      // Listen for our custom navigation start event
      window.addEventListener("navigationStart", handleNavigationStart);

      // Listen for client-side changes to indicate navigation completion
      const mutationObserver = new MutationObserver((mutations) => {
        // If we detect DOM changes after navigation started, it's likely the page has loaded
        if (document.body.getAttribute("data-navigation-active") === "true") {
          // Check if navigation has finished by looking at mutations
          const navigationFinished = mutations.some(
            (mutation) =>
              mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0
          );

          if (navigationFinished) {
            handleRouteChangeComplete();
          }
        }
      });

      // Watch for changes to the entire document
      mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      });

      return () => {
        // Clean up event listeners and observers
        window.removeEventListener("navigationStart", handleNavigationStart);
        if (navigationTimeout) clearTimeout(navigationTimeout);
        mutationObserver.disconnect();
      };
    }, []);

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
