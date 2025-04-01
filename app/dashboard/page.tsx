"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ResumeViewer } from "@/components/resume-viewer"

interface Application {
  id: string
  jobOffer: {
    id: string
    title: string
    organization: {
      name: string
    }
  }
  status: string
  appliedDate: string
  resumeUrl?: string
  coverLetter?: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  // Fetch applications only once on component mount
  useEffect(() => {
    let isMounted = true

    async function fetchApplications() {
      try {
        setIsLoading(true)
        const data = await getApplications()

        if (isMounted) {
          setApplications(data)
        }
      } catch (err) {
        console.error("Error fetching applications:", err)
        if (isMounted) {
          setError("Failed to load your applications. Please try again.")
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchApplications()

    return () => {
      isMounted = false
    }
  }, [])

  // Memoize derived data to prevent unnecessary calculations
  const stats = useMemo(() => {
    const selected = applications.filter((app) => app.status.toLowerCase() === "selected").length
    const pending = applications.filter((app) => app.status.toLowerCase() === "pending").length
    const rejected = applications.filter((app) => app.status.toLowerCase() === "rejected").length

    return { total: applications.length, selected, pending, rejected }
  }, [applications])

  // Memoize status badge renderer
  const getStatusBadge = useCallback((status: string) => {
    switch (status.toLowerCase()) {
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
  }, [])

  const handleViewApplication = useCallback((application: Application) => {
    setSelectedApplication(application)
  }, [])

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
                  <div className="text-3xl font-bold">{stats.total}</div>
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
                  <div className="text-3xl font-bold">{stats.selected}</div>
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
                  <div className="text-3xl font-bold">{stats.pending}</div>
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
                              You haven't applied to any jobs yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          applications.map((application) => (
                            <TableRow key={application.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{application.jobOffer.title}</TableCell>
                              <TableCell>{application.jobOffer.organization.name}</TableCell>
                              <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                              <TableCell>{getStatusBadge(application.status)}</TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleViewApplication(application)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                      <DialogTitle>Application Details</DialogTitle>
                                    </DialogHeader>
                                    {selectedApplication && (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <div className="text-sm font-medium">Job:</div>
                                          <div className="col-span-3">
                                            <div className="font-medium">{selectedApplication.jobOffer.title}</div>
                                            <div className="text-sm text-muted-foreground">
                                              {selectedApplication.jobOffer.organization.name}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <div className="text-sm font-medium">Applied Date:</div>
                                          <div className="col-span-3">
                                            {new Date(selectedApplication.appliedDate).toLocaleDateString()}
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                          <div className="text-sm font-medium">Status:</div>
                                          <div className="col-span-3">{getStatusBadge(selectedApplication.status)}</div>
                                        </div>
                                        {selectedApplication.resumeUrl && (
                                          <div className="grid grid-cols-4 items-center gap-4">
                                            <div className="text-sm font-medium">Resume:</div>
                                            <div className="col-span-3">
                                              <ResumeViewer
                                                resumeUrl={selectedApplication.resumeUrl}
                                                studentName="Your Resume"
                                              />
                                            </div>
                                          </div>
                                        )}
                                        {selectedApplication.coverLetter && (
                                          <div className="grid grid-cols-4 items-start gap-4">
                                            <div className="text-sm font-medium">Cover Letter:</div>
                                            <div className="col-span-3 text-sm">{selectedApplication.coverLetter}</div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
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
                  <div className="text-center py-6 text-muted-foreground">No new notifications</div>
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
                  <div className="text-center py-6 text-muted-foreground">No upcoming events</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

