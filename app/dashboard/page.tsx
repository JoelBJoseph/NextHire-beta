"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Briefcase, FileText, Bell, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getApplications } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Application {
  id: number | string
  jobTitle: string
  company: string
  appliedDate: string
  status: string
}

interface Notification {
  id: number | string
  message: string
  time: string
}

interface Event {
  id: number | string
  title: string
  date: string
  time: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)

        // Fetch applications
        const applicationsData = await getApplications()

        // Format applications for display
        const formattedApplications = applicationsData.map((app: any) => ({
          id: app.id,
          jobTitle: app.jobOffer.title,
          company: app.jobOffer.organization.name,
          appliedDate: new Date(app.appliedDate).toLocaleDateString(),
          status: app.status.toLowerCase(),
        }))

        setApplications(formattedApplications)

        // In a real app, we would fetch notifications and events from the API
        // For now, we'll use empty arrays
        setNotifications([])
        setUpcomingEvents([])
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load your applications. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "selected":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Selected
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const handleViewApplication = (id: number | string) => {
    // In a real app, this would navigate to the application details page
    router.push(`/applications/${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <LoadingSpinner size="lg" className="text-blue-600" />
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your applications and career opportunities</p>
            </div>
            <Button asChild>
              <Link href="/offers">
                <Briefcase className="mr-2 h-4 w-4" />
                Browse Jobs
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
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
                  <div className="text-3xl font-bold">{applications.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Applications submitted</p>
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
                  <div className="text-3xl font-bold">
                    {applications.filter((app) => app.status === "selected").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Applications approved</p>
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
                  <div className="text-3xl font-bold">
                    {applications.filter((app) => app.status === "pending").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>My Applications</CardTitle>
                      <CardDescription>Track the status of your job applications</CardDescription>
                    </div>
                    <Link href="/profile">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Resume
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Position</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Applied Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                              You haven&#39;t applied to any jobs yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          applications.map((application) => (
                            <TableRow key={application.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{application.jobTitle}</TableCell>
                              <TableCell>{application.company}</TableCell>
                              <TableCell>{application.appliedDate}</TableCell>
                              <TableCell>{getStatusBadge(application.status)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewApplication(application.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-blue-500" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">No new notifications</div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">No upcoming events</div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
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
        </div>
      </div>
    </div>
  )
}

