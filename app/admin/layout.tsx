"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Settings,
  HelpCircle,
  LogOut,
  FileText,
  Menu,
  X,
  BarChart,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function AdminLayout({
                                      children,
                                    }: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isLoading, isAuthenticated, signOut } = useAuth()

  // Redirect if not authenticated or not an admin/organization
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    } else if (!isLoading && isAuthenticated && user?.role !== "ADMIN" && user?.role !== "ORGANIZATION") {
      router.push("/dashboard")
    }
  }, [isLoading, isAuthenticated, user, router])

  // Hide the main header when in admin pages
  useEffect(() => {
    const header = document.querySelector("header")
    const footer = document.querySelector("footer")

    if (header) header.style.display = "none"
    if (footer) footer.style.display = "none"

    return () => {
      if (header) header.style.display = ""
      if (footer) footer.style.display = ""
    }
  }, [])

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(false)
    }
  }, [pathname])

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("adminSidebarOpen")
    if (savedState !== null) {
      setSidebarOpen(savedState === "true")
    }
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("adminSidebarOpen", sidebarOpen.toString())
  }, [sidebarOpen])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const navItems = [
    { href: "/admin/home", label: "Dashboard", icon: Home },
    { href: "/admin/applications", label: "Applications", icon: FileText },
    { href: "/admin/jobs", label: "Job Listings", icon: BarChart },
    { href: "/admin/add-job", label: "Add New Job", icon: PlusCircle },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/help", label: "Support", icon: HelpCircle },
  ]

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center">
          <LoadingSpinner size="lg" className="text-blue-600" />
        </div>
    )
  }

  return (
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
        {/* Sidebar for desktop */}
        <div
            className={cn(
                "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out md:relative",
                sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-16 md:translate-x-0",
                mobileMenuOpen ? "translate-x-0" : "",
            )}
        >
          <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-800 border-r">
            <div className="flex items-center justify-between px-4 py-5">
              <Link href="/admin/home" className={cn("flex items-center", !sidebarOpen && "md:hidden")}>
                <Image src="/logo-achu.png" alt="NextHire" width={120} height={40} className="h-8 w-auto" priority />
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-grow flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                      <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                              "group flex items-center py-2 text-sm font-medium rounded-md transition-colors",
                              sidebarOpen ? "px-4" : "px-2 md:justify-center",
                              pathname === item.href
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                          )}
                      >
                        <Icon className={cn("h-5 w-5", sidebarOpen ? "mr-3" : "mr-0")} />
                        {sidebarOpen && <span>{item.label}</span>}
                      </Link>
                  )
                })}
              </nav>
              {sidebarOpen && (
                  <>
                    <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex-shrink-0 w-full group block">
                        <div className="flex items-center">
                          <div>
                            <img
                                className="inline-block h-9 w-9 rounded-full"
                                src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                                alt=""
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {user?.role === "ADMIN" ? "Administrator" : "Organization"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                      <button
                          onClick={() => signOut()}
                          className="flex items-center w-full text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar toggle button for desktop */}
        <button
            onClick={toggleSidebar}
            className="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-md p-1 shadow-md"
            style={{
              left: sidebarOpen ? "15.5rem" : "3.5rem",
              transition: "left 300ms ease-in-out",
            }}
        >
          {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
          ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {/* Overlay for mobile */}
        {mobileMenuOpen && (
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setMobileMenuOpen(false)}
            ></div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(true)}
                  className={cn(mobileMenuOpen && "hidden")}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/admin/home" className="flex items-center ml-2">
                <Image src="/logo.png" alt="NextHire" width={120} height={40} className="h-8 w-auto" priority />
              </Link>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Exit Admin</span>
              </Button>
            </Link>
          </div>

          {/* Desktop header with toggle button */}
          <div className="hidden md:flex items-center h-16 px-4 border-b bg-white dark:bg-gray-800">
            <div className="flex-1"></div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Exit Admin</span>
              </Button>
            </Link>
          </div>

          {/* Main content area */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-20" // Add padding at the bottom for mobile scrolling
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
  )
}

