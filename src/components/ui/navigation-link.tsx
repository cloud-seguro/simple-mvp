"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Don't override if ctrl/cmd key is pressed (new tab behavior)
      if (e.ctrlKey || e.metaKey) {
        if (onClick) onClick(e);
        return;
      }

      e.preventDefault();

      // Trigger loading state immediately
      window.dispatchEvent(new CustomEvent("navigationStart"));

      // Call the original onClick if it exists
      if (onClick) onClick(e);

      // Start a fade-out animation and navigate immediately
      document.body.setAttribute("data-navigation-active", "true");

      // Use a minimal timeout to allow the visual feedback to register
      // This makes navigation feel more responsive while still showing the loading indicator
      setTimeout(() => {
        router.push(href);
      }, 10);
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
        window.dispatchEvent(new CustomEvent("navigationEnd"));
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
        }, 5000); // Maximum 5 seconds for navigation
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
            document.body.setAttribute("data-navigation-active", "false");
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
