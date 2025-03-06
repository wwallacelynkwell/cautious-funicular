"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  title: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                "hover:text-foreground transition-colors ml-1",
                index === items.length - 1 && "text-foreground font-medium"
              )}
            >
              {item.title}
            </Link>
          ) : (
            <span className="text-foreground font-medium ml-1">{item.title}</span>
          )}
        </div>
      ))}
    </nav>
  )
} 