"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/offers", label: "Job Offers" },
  { href: "/contact", label: "Contact" },
]

interface MainNavProps {
  mobile?: boolean
  closeMenu?: () => void
}

export function MainNav({ mobile = false, closeMenu }: MainNavProps) {
  const pathname = usePathname()

  if (mobile) {
    return (
      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-md py-2 px-3 text-sm font-medium",
              pathname === item.href
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-gray-900 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-blue-400",
            )}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "relative px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === item.href
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400",
          )}
          onClick={closeMenu}
        >
          {pathname === item.href && (
            <motion.span
              className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-md z-[-1]"
              layoutId="navbar-active-item"
              transition={{ type: "spring", duration: 0.6 }}
            />
          )}
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

