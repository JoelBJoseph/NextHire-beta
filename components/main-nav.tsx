"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MainNavProps {
  mobile?: boolean
  closeMenu?: () => void
}

export function MainNav({ mobile, closeMenu }: MainNavProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/offers",
      label: "Job Offers",
      active: pathname === "/offers",
    },
    {
      href: "/contact",
      label: "Contact",
      active: pathname === "/contact",
    },
  ]

  if (mobile) {
    return (
      <div className="flex flex-col space-y-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={closeMenu}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-black dark:text-white" : "text-muted-foreground",
            )}
          >
            {route.label}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <nav className="flex items-center space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

