"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Download, Filter, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"

// Import the ResumeViewer component
import { ResumeViewer } from "@/components/resume-viewer"

// Remove this mock data
// const initialApplications = [
//   {
//     id: 1,
//     studentName: "John Doe",
//     studentEmail: "john@example.com",
//     jobTitle: "Software Engineer",
//     company: "Tech Corp",
//     appliedDate: "2023-07-15",
//     status: "pending",
//     passingYear: "2023",
//     resumeUrl: "#",
//     address: "123 Main St, San Francisco, CA",
//   },
//   {
//     id: 2,
//     studentName: "Jane Smith",
//     studentEmail: "jane@example.com",
//     jobTitle: "UX Designer",
//     company: "Creative Solutions",
//     appliedDate: "2023-07-12",
//     status: "selected",
//     passingYear: "2023",
//     resumeUrl: "#",
//     address: "456 Oak Ave, New York, NY",
//   },
//   {
//     id: 3,
//     studentName: "Alice Johnson",
//     studentEmail: "alice@example.com",
//     jobTitle: "Data Scientist",
//     company: "Data Insights Inc",
//     appliedDate: "2023-07-10",
//     status: "rejected",
//     passingYear: "2024",
//     resumeUrl: "#",
//     address: "789 Pine St, Chicago, IL",
//   },
//   {
//     id: 4,
//     studentName: "Bob Brown",
//     studentEmail: "bob@example.com",
//     jobTitle: "Software Engineer",
//     company: "Tech Corp",
//     appliedDate: "2023-07-09",
//     status: "pending",
//     passingYear: "2022",
//     resumeUrl: "#",
//     address: "101 Maple Dr, Austin, TX",
//   },
//   {
//     id: 5,
//     studentName: "Emily White",
//     studentEmail: "emily@example.com",
//     jobTitle: "Product Manager",
//     company: "Innovate Co",
//     appliedDate: "2023-07-08",
//     status: "selected",
//     passingYear: "2023",
//     resumeUrl: "#",
//     address: "202 Cedar Ln, Seattle, WA",
//   },
// ]

type ApplicationStatus = "pending" | "selected" | "rejected"

interface Application {
  id: string
  studentName: string
  studentEmail: string
  jobTitle: string
  company: string
  appliedDate: string
  status: ApplicationStatus
  passingYear: string
  resumeUrl: string
  address: string
}

// Create a reusable ApplicationDetailsDialog component
function ApplicationDetailsDialog({
  application,
  onStatusChange,
}: {
  application: Application | null
  onStatusChange: (id: string, status: ApplicationStatus) => void
}) {
  if (!application) return null

  return (
    <>
      <DialogHeader>
        <DialogTitle>Application Details</DialogTitle>
        <DialogDescription>Review and update the status of this application</DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-sm font-medium">Student:</div>
          <div className="col-span-3">
            <div className="font-medium">{application.studentName}</div>
            <div className="text-sm text-muted-foreground">{application.studentEmail}</div>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-sm font-medium">Address:</div>
          <div className="col-span-3">{application.address}</div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-sm font-medium">Applied For:</div>
          <div className="col-span-3">
            <div>{application.jobTitle}</div>
            <div className="text-sm text-muted-foreground">{application.company}</div>
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-sm font-medium">Date Applied:</div>
          <div className="col-span-3">{application.appliedDate}</div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-sm font-medium">Passing Year:</div>
          <div className="col-span-3">{application.passingYear}</div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-sm font-medium">Resume:</div>
          <div className="col-span-3">
            <ResumeViewer resumeUrl="#" studentName={application.studentName} />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <div className="text-sm font-medium">Status:</div>
          <div className="col-span-3">
            <Select
              value={application.status}
              onValueChange={(value) => onStatusChange(application.id, value as ApplicationStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch("/api/applications")
        if (!response.ok) {
          throw new Error("Failed to fetch applications")
        }
        const data = await response.json()
        setApplications(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load applications. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update application status")
      }

      // Update the local state
      setApplications(applications.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app)))

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus })
      }

      toast({
        title: "Status updated",
        description: `Application status has been updated to ${newStatus.toLowerCase()}.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update application status. Please try again.",
      })
    }
  }

  const handleOpenDialog = (application: Application) => {
    setSelectedApplication(application)
    setDialogOpen(true)
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        )
      case "selected":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Selected
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Rejected
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Student Applications</h1>
        <p className="text-muted-foreground">Review and manage all student applications to your job listings.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <CardTitle>Applications Management</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search applications..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}
              >
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Applications</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="selected">Selected</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Job Position</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Passing Year</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No applications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="font-medium">{application.studentName}</div>
                            <div className="text-sm text-muted-foreground">{application.studentEmail}</div>
                          </TableCell>
                          <TableCell>
                            <div>{application.jobTitle}</div>
                            <div className="text-sm text-muted-foreground">{application.company}</div>
                          </TableCell>
                          <TableCell>{application.appliedDate}</TableCell>
                          <TableCell>{application.passingYear}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            <Dialog
                              open={dialogOpen && selectedApplication?.id === application.id}
                              onOpenChange={(open) => {
                                if (!open) setDialogOpen(false)
                                if (open) handleOpenDialog(application)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <ApplicationDetailsDialog
                                  application={selectedApplication}
                                  onStatusChange={handleStatusChange}
                                />
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="pending">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Job Position</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Passing Year</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.filter((app) => app.status === "pending").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No pending applications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications
                        .filter((app) => app.status === "pending")
                        .map((application) => (
                          <TableRow key={application.id}>
                            <TableCell>
                              <div className="font-medium">{application.studentName}</div>
                              <div className="text-sm text-muted-foreground">{application.studentEmail}</div>
                            </TableCell>
                            <TableCell>
                              <div>{application.jobTitle}</div>
                              <div className="text-sm text-muted-foreground">{application.company}</div>
                            </TableCell>
                            <TableCell>{application.appliedDate}</TableCell>
                            <TableCell>{application.passingYear}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() => handleStatusChange(application.id, "selected")}
                                >
                                  Select
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleStatusChange(application.id, "rejected")}
                                >
                                  Reject
                                </Button>
                                <Dialog
                                  open={dialogOpen && selectedApplication?.id === application.id}
                                  onOpenChange={(open) => {
                                    if (!open) setDialogOpen(false)
                                    if (open) handleOpenDialog(application)
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[600px]">
                                    <ApplicationDetailsDialog
                                      application={selectedApplication}
                                      onStatusChange={handleStatusChange}
                                    />
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="selected">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Job Position</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Passing Year</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.filter((app) => app.status === "selected").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No selected applications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications
                        .filter((app) => app.status === "selected")
                        .map((application) => (
                          <TableRow key={application.id}>
                            <TableCell>
                              <div className="font-medium">{application.studentName}</div>
                              <div className="text-sm text-muted-foreground">{application.studentEmail}</div>
                            </TableCell>
                            <TableCell>
                              <div>{application.jobTitle}</div>
                              <div className="text-sm text-muted-foreground">{application.company}</div>
                            </TableCell>
                            <TableCell>{application.appliedDate}</TableCell>
                            <TableCell>{application.passingYear}</TableCell>
                            <TableCell className="text-right">
                              <Dialog
                                open={dialogOpen && selectedApplication?.id === application.id}
                                onOpenChange={(open) => {
                                  if (!open) setDialogOpen(false)
                                  if (open) handleOpenDialog(application)
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                  <ApplicationDetailsDialog
                                    application={selectedApplication}
                                    onStatusChange={handleStatusChange}
                                  />
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="rejected">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Job Position</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Passing Year</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.filter((app) => app.status === "rejected").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No rejected applications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredApplications
                        .filter((app) => app.status === "rejected")
                        .map((application) => (
                          <TableRow key={application.id}>
                            <TableCell>
                              <div className="font-medium">{application.studentName}</div>
                              <div className="text-sm text-muted-foreground">{application.studentEmail}</div>
                            </TableCell>
                            <TableCell>
                              <div>{application.jobTitle}</div>
                              <div className="text-sm text-muted-foreground">{application.company}</div>
                            </TableCell>
                            <TableCell>{application.appliedDate}</TableCell>
                            <TableCell>{application.passingYear}</TableCell>
                            <TableCell className="text-right">
                              <Dialog
                                open={dialogOpen && selectedApplication?.id === application.id}
                                onOpenChange={(open) => {
                                  if (!open) setDialogOpen(false)
                                  if (open) handleOpenDialog(application)
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                  <ApplicationDetailsDialog
                                    application={selectedApplication}
                                    onStatusChange={handleStatusChange}
                                  />
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

