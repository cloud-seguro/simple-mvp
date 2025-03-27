"use client";

import Link from "next/link";

export function SimpleHeader() {
  return (
    <header className="p-6 bg-white border-b shadow-sm">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
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
