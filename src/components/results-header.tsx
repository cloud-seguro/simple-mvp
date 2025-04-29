"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

export function ResultsHeader() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <header className="p-6 bg-white border-b shadow-sm">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>
              {isLoggedIn ? "Volver al dashboard" : "Volver al inicio"}
            </span>
          </Link>
        </Button>
        <Link
          href="/"
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold text-gray-800">SIMPLE</span>
        </Link>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </header>
  );
}
