'use client';

import { useAuth } from "@/providers/auth-provider";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export function AuthHeader() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-9 w-[100px] animate-pulse rounded-md bg-muted" />;
  }

  if (user) {
    return <DashboardButton />;
  }

  return (
    <div className="flex items-center space-x-2">
      <Link href="/sign-in">
        <Button variant="outline" className="flex items-center gap-1">
          <LogIn size={16} />
          Iniciar Sesión
        </Button>
      </Link>
    </div>
  );
} 