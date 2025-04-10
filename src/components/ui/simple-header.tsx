"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SimpleHeaderProps {
  className?: string;
}

export function SimpleHeader({ className }: SimpleHeaderProps) {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <header className="p-6">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <Link href="/" className={cn("flex items-center gap-2", className)}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold text-gray-800">SIMPLE</span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-1 hover:bg-gray-100"
        >
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            <ChevronLeft className="h-4 w-4" />
            <span>
              {isAuthenticated ? "Volver al dashboard" : "Volver al inicio"}
            </span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
