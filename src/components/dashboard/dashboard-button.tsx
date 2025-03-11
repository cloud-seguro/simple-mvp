'use client';

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardButtonProps {
  className?: string;
}

export default function DashboardButton({ className }: DashboardButtonProps = {}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading || !user) return null;

  return (
    <Button
      onClick={() => router.push("/dashboard")}
      variant="outline"
      className={`w-full md:w-auto border-black text-black hover:bg-black hover:text-yellow-400 transition-colors ${className}`}
    >
      <LayoutDashboard className="h-4 w-4" />
      Dashboard
    </Button>
  );
} 