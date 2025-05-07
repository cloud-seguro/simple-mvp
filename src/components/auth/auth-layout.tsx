"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  showLogo?: boolean;
  className?: string;
}

export default function AuthLayout({
  children,
  showLogo = true,
  className,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-12">
        <div className={cn("w-full max-w-md", className)}>
          {showLogo && (
            <div className="flex justify-center mb-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">SIMPLE</span>
              </Link>
            </div>
          )}
          {children}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} SIMPLE. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
