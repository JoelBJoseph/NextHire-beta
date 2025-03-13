"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Eye, Briefcase, FileText, Bell, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

// Add this near the top of the component
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function StudentDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [applications, setApplications] = useState(null)
  const [events, setEvents] = useState(null)
  const [notifications, setNotifications] = useState(null)
  const [applicationsError, setApplicationsError] = useState(null)
  const [eventsError, setEventsError] = useState(null)
  const [notificationsError, setNotificationsError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicationsData = await fetcher("/api/applications")
        setApplications(applicationsData)
        const eventsData = await fetcher("/api/events")
        setEvents(eventsData)
        const notificationsData = await fetcher("/api/notifications")
        setNotifications(notificationsData)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        if (error.message.includes("applications")) setApplicationsError(error)
        if (error.message.includes("events")) setEventsError(error)
        if (error.message.includes("notifications")) setNotificationsError(error)
        toast({
          variant: "destructive",
          title: "Error loading data",
          description: "Failed to load your dashboard information.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "SELECTED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Selected
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {status}
          </Badge>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
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
                  <div className="text-3xl font-bold">{applications ? applications.length : 0}</div>
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
                    {applications ? applications.filter((app) => app.status === "SELECTED").length : 0}
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
                    {applications ? applications.filter((app) => app.status === "PENDING").length : 0}
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
                        {!applications || applications.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                              You haven't applied to any jobs yet
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
                                <Button variant="ghost" size="icon" className="h-8 w-8">
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
                  {!notifications || notifications.length === 0 ? (
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
                  {!events || events.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">No upcoming events</div>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event) => (
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

