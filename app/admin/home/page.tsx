"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Users, FileText, Briefcase, TrendingUp, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/loading-spinner"

interface DashboardData {
  totalApplications: number
  pendingApplications: number
  selectedApplications: number
  rejectedApplications: number
  totalJobs: number
  activeJobs: number
  totalStudents: number
  recentApplications: {
    id: number | string
    studentName: string
    jobTitle: string
    date: string
    status: string
  }[]
  upcomingEvents: {
    id: number | string
    title: string
    date: string
    time: string
  }[]
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        // For now, we'll use empty data since the API endpoint might not be ready
        setData({
          totalApplications: 0,
          pendingApplications: 0,
          selectedApplications: 0,
          rejectedApplications: 0,
          totalJobs: 0,
          activeJobs: 0,
          totalStudents: 0,
          recentApplications: [],
          upcomingEvents: [],
        })
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.")
        console.error("Error fetching dashboard data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
      case "selected":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Selected</span>
      case "rejected":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <LoadingSpinner size="md" className="text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-500 mb-4">No dashboard data available</div>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's what's happening with your organization.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">Applications received</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.selectedApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">Candidates selected</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.pendingApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">Applications to review</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.activeJobs}</div>
              <p className="text-xs text-muted-foreground mt-1">Open positions</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest candidates who applied to your job listings</CardDescription>
                </div>
                <Link href="/admin/applications">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {data.recentApplications.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No recent applications</div>
              ) : (
                <div className="space-y-4">
                  {data.recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{application.studentName}</p>
                        <p className="text-sm text-muted-foreground">{application.jobTitle}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">{application.date}</div>
                        <div>{getStatusBadge(application.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Scheduled events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              {data.upcomingEvents.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No upcoming events</div>
              ) : (
                <div className="space-y-4">
                  {data.upcomingEvents.map((event) => (
                    <div key={event.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="mr-2 h-4 w-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="mr-2 h-4 w-4" />
                        {event.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Statistics</CardTitle>
            <CardDescription>Overview of application status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2">
              <div className="relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-16 bg-blue-500 rounded-t-md"
                  style={{ height: `${(data.totalApplications / Math.max(data.totalApplications, 1)) * 100}%` }}
                ></div>
                <span className="mt-2 text-sm">Total</span>
              </div>
              <div className="relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-16 bg-yellow-500 rounded-t-md"
                  style={{ height: `${(data.pendingApplications / Math.max(data.totalApplications, 1)) * 100}%` }}
                ></div>
                <span className="mt-2 text-sm">Pending</span>
              </div>
              <div className="relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-16 bg-green-500 rounded-t-md"
                  style={{ height: `${(data.selectedApplications / Math.max(data.totalApplications, 1)) * 100}%` }}
                ></div>
                <span className="mt-2 text-sm">Selected</span>
              </div>
              <div className="relative h-full flex flex-col justify-end items-center">
                <div
                  className="w-16 bg-red-500 rounded-t-md"
                  style={{ height: `${(data.rejectedApplications / Math.max(data.totalApplications, 1)) * 100}%` }}
                ></div>
                <span className="mt-2 text-sm">Rejected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/add-job">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <Briefcase className="h-6 w-6" />
                  <span>Post New Job</span>
                </Button>
              </Link>
              <Link href="/admin/applications?status=pending">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span>Review Applications</span>
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <Users className="h-6 w-6" />
                  <span>Manage Profile</span>
                </Button>
              </Link>
              <Link href="/admin/jobs">
                <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

