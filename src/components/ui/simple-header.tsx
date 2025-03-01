"use client"

import Link from "next/link"

interface SimpleHeaderProps {
  className?: string
}

export function SimpleHeader({ className = "" }: SimpleHeaderProps) {
  return (
    <Link href="/">
      <h1 className={`text-2xl font-bold cursor-pointer ${className}`}>
        SIMPLE
      </h1>
    </Link>
  )
} 