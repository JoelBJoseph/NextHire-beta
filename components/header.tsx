"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
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
import { LogOut, User, LayoutDashboard, Settings, Menu, ChevronDown } from "lucide-react"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, signOut } = useAuth()

  // Automatically close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isAuthPage = pathname === "/login" || pathname === "/register"
  const isAdminPage = pathname.startsWith("/admin")

  // Don't render header on admin pages
  if (isAdminPage) return null

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo-achu.png" alt="NextHire" width={120} height={40} className="h-8 w-auto" priority />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <div className="hidden md:flex md:flex-1 md:justify-center">
              <MainNav />
            </div>
          )}

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
          {!isAuthPage && (
            <div className="md:hidden">
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mr-2">
                  {isAuthenticated && (
                    <>
                      <DropdownMenuLabel className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <span>{user?.name}</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/" onClick={() => setMenuOpen(false)}>
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/offers" onClick={() => setMenuOpen(false)}>
                      Job Offers
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/contact" onClick={() => setMenuOpen(false)}>
                      Contact
                    </Link>
                  </DropdownMenuItem>

                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" onClick={() => setMenuOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {(user?.role === "ADMIN" || user?.role === "ORGANIZATION") && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin/home" onClick={() => setMenuOpen(false)}>
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
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/login" onClick={() => setMenuOpen(false)}>
                          Log in
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/register" onClick={() => setMenuOpen(false)}>
                          Sign up
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex w-full justify-between items-center">
                      <span>Theme</span>
                      <ThemeToggle />
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

