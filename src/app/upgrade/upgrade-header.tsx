"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface UpgradeHeaderProps {
  className?: string;
}

export function UpgradeHeader({ className }: UpgradeHeaderProps) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="p-4 md:p-8 bg-background border-b">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className={cn("flex items-center gap-2", className)}>
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold">SIMPLE</span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-1 hover:bg-red-50 text-red-600 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </Button>
      </div>
    </header>
  );
}
