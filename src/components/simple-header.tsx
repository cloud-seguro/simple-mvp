"use client";

import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

export function SimpleHeader() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <header className="p-4 sm:p-6 bg-white border-b shadow-sm">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-800">
            SIMPLE
          </span>
        </Link>
        <div
          className={`text-xs sm:text-sm text-gray-500 ${isMobile ? "hidden sm:block" : ""}`}
        >
          {new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: isMobile ? "short" : "long",
            day: "numeric",
          })}
        </div>
      </div>
    </header>
  );
}
