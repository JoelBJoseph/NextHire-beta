"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"
import { Edit, Trash2, MapPin, Building, DollarSign, Clock, Briefcase, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getJobOfferById, deleteJobOffer } from "@/lib/api"

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

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
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
        setJob(data)
      } catch (err) {
        setError("Failed to load job details. Please try again later.")
        console.error("Error fetching job details:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobDetails()
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
      case "closed":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Closed
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
              <CardDescription>{job.applications} candidates have applied to this job</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/admin/applications")}>
                View Applications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

