"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"
import { Edit, Trash2, MapPin, Building, DollarSign, Clock, Briefcase, Calendar, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getJobOfferById, deleteJobOffer, getApplications, updateApplication } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResumeViewer } from "@/components/resume-viewer"

interface Job {
  id: string
  title: string
  description: string
  company: string
  location: string
  salary: string
  type: string
  experience: string
  skills: string[]
  applications: number
  createdAt: string
  status: string
}

interface Application {
  id: string
  user: {
    id: string
    name: string
    email: string
    profile?: {
      resumeUrl?: string
      address?: string
    }
  }
  status: string
  appliedDate: string
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingApplications, setIsLoadingApplications] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        setIsLoading(true)
        const data = await getJobOfferById(jobId)
        if (!data) {
          setError("Job not found")
          return
        }

        setJob({
          id: data.id,
          title: data.title,
          description: data.description,
          company: data.organization.name,
          location: data.location,
          salary: data.salary || "Not specified",
          type: data.type,
          experience: data.experience || "Not specified",
          skills: data.skills || [],
          applications: data.applications?.length || 0,
          createdAt: new Date(data.createdAt).toLocaleDateString(),
          status: data.status,
        })
      } catch (err) {
        setError("Failed to load job details. Please try again later.")
        console.error("Error fetching job details:", err)
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchApplications() {
      try {
        setIsLoadingApplications(true)
        const allApplications = await getApplications()
        // Filter applications for this job
        const jobApplications = allApplications.filter((app: any) => app.jobOffer.id === jobId)
        setApplications(jobApplications)
      } catch (err) {
        console.error("Error fetching applications:", err)
      } finally {
        setIsLoadingApplications(false)
      }
    }

    fetchJobDetails()
    fetchApplications()
  }, [jobId])

  const handleDeleteJob = async () => {
    try {
      setIsDeleting(true)
      await deleteJobOffer(jobId)
      toast({
        title: "Job deleted",
        description: "The job listing has been successfully deleted.",
      })
      router.push("/admin/jobs")
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete the job listing. Please try again.",
        variant: "destructive",
      })
      console.error("Error deleting job:", err)
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(true)
      await updateApplication(applicationId, { status: newStatus.toUpperCase() })

      // Update local state
      setApplications(
        applications.map((app) => (app.id === applicationId ? { ...app, status: newStatus.toUpperCase() } : app)),
      )

      toast({
        title: "Status updated",
        description: `Application status has been updated to ${newStatus}.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating application status:", err)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
      case "closed":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Closed
          </Badge>
        )
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

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-4">{error || "Job not found"}</div>
        <Button onClick={() => router.push("/admin/jobs")}>Back to Jobs</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
          <p className="text-muted-foreground flex items-center">
            <Building className="mr-2 h-4 w-4" />
            {job.company}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/admin/jobs/${jobId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this job listing? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteJob} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {job.description.split("\n\n").map((paragraph, index) => (
                  <div key={index} className="mb-4">
                    {paragraph.startsWith("- ") ? (
                      <ul className="list-disc list-inside">
                        {paragraph.split("\n").map((item, i) => (
                          <li key={i}>{item.substring(2)}</li>
                        ))}
                      </ul>
                    ) : paragraph.endsWith(":") ? (
                      <h3 className="text-lg font-semibold mb-2">{paragraph}</h3>
                    ) : (
                      <p>{paragraph}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{job.experience}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Posted on {job.createdAt}</span>
              </div>
              <div className="pt-2">
                <span className="text-sm font-medium">Status: </span>
                {getStatusBadge(job.status)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
              <CardDescription>{applications.length} candidates have applied to this job</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/admin/applications")}>
                <Users className="mr-2 h-4 w-4" />
                View All Applications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Applications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Applications for this Job</CardTitle>
          <CardDescription>Review and manage applications for this position</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingApplications ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" className="text-blue-600" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No applications have been submitted for this job yet.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div className="font-medium">{application.user.name}</div>
                        <div className="text-sm text-muted-foreground">{application.user.email}</div>
                      </TableCell>
                      <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>
                        {application.user.profile?.resumeUrl ? (
                          <ResumeViewer
                            resumeUrl={application.user.profile.resumeUrl}
                            studentName={application.user.name}
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">No resume</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={application.status.toLowerCase()}
                          onValueChange={(value) => handleUpdateApplicationStatus(application.id, value)}
                          disabled={isUpdatingStatus}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="selected">Select</SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

