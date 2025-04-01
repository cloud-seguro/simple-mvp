"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface SimpleHeaderProps {
  className?: string;
}

export function SimpleHeader({ className }: SimpleHeaderProps) {
  return (
    <header className="p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className={cn("flex items-center gap-2", className)}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold text-gray-800">SIMPLE</span>
        </Link>
      </div>
    </header>
  );
}
