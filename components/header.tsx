"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, LayoutDashboard, Settings, Menu, X, ChevronDown } from "lucide-react"

// Optimize the mobile menu to reduce unnecessary re-renders
const MobileMenu = ({ isOpen, onClose, user, isAuthenticated, signOut }) => {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <motion.div
      className="md:hidden fixed inset-0 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Black/white overlay with blur */}
      <motion.div
        className="fixed inset-0 bg-black/50 dark:bg-white/20 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      ></motion.div>

      {/* Mobile menu - slide down */}
      <motion.div
        className="relative bg-background w-full shadow-xl overflow-y-auto"
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="flex items-center" onClick={onClose}>
            <Image src="/logo-achu.png" alt="NextHire" width={120} height={40} className="h-8 w-auto" priority />
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        {isAuthenticated ? (
          <div className="p-4">
            <div className="flex items-center gap-3 p-3 mb-2 bg-muted/50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-1 py-4">
              <MainNav mobile closeMenu={onClose} />
            </div>

            <div className="space-y-1 py-4 border-t">
              <Link
                href="/profile"
                className="flex items-center rounded-md py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center rounded-md py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
              {(user?.role === "ADMIN" || user?.role === "ORGANIZATION") && (
                <Link
                  href="/admin/home"
                  className="flex items-center rounded-md py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                  onClick={onClose}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {user.role === "ADMIN" ? "Admin Panel" : "Organization Panel"}
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="flex w-full items-center rounded-md py-2 px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-1 py-4">
              <MainNav mobile closeMenu={onClose} />
            </div>
            <div className="space-y-1 py-4 border-t">
              <Link
                href="/login"
                className="flex items-center rounded-md py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex items-center rounded-md py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                Sign up
              </Link>
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2023 NextHire. All rights reserved.</p>
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, signOut } = useAuth()

  const closeMenu = () => setMobileMenuOpen(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const isAuthPage = pathname === "/login" || pathname === "/register"
  const isAdminPage = pathname.startsWith("/admin")

  // Don't render header on admin pages
  if (isAdminPage) return null

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <Image src="/logo-achu.png" alt="NextHire" width={120} height={40} className="h-8 w-auto" priority />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <MainNav closeMenu={closeMenu} />
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!isAuthPage && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm" className="h-9">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 gap-1">
                          <Avatar className="h-6 w-6 mr-1">
                            <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <span className="hidden sm:inline-block">{user?.name?.split(" ")[0]}</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {(user?.role === "ADMIN" || user?.role === "ORGANIZATION") && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin/home" className="cursor-pointer">
                              <Settings className="mr-2 h-4 w-4" />
                              {user.role === "ADMIN" ? "Admin Panel" : "Organization Panel"}
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">Sign up</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide down with blur effect */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={closeMenu}
            user={user}
            isAuthenticated={isAuthenticated}
            signOut={signOut}
          />
        )}
      </AnimatePresence>
    </header>
  )
}

