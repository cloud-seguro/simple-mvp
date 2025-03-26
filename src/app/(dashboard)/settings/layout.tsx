"use client";

import { Separator } from "@/components/ui/separator";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 p-6 pb-16">
      <Separator className="mb-6" />
      <div className="flex-1 max-w-3xl mx-auto">{children}</div>
    </div>
  );
}
