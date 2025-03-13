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
import { toast } from "@/components/ui/use-toast"

// Mock job data
const mockJob = {
  id: "1",
  title: "Software Engineer",
  description:
    "We are looking for a skilled software engineer to join our team. The ideal candidate will have experience with React, Node.js, and TypeScript.\n\nResponsibilities:\n- Develop and maintain web applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code\n- Participate in code reviews\n\nRequirements:\n- 3+ years of experience in software development\n- Strong proficiency in JavaScript/TypeScript\n- Experience with React and Node.js\n- Familiarity with MongoDB or similar NoSQL databases\n- Experience with AWS or other cloud platforms",
  company: "Tech Corp",
  location: "San Francisco, CA",
  salary: "$80,000 - $120,000",
  type: "Full-time",
  experience: "3+ years",
  skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
  applications: 12,
  createdAt: "2023-07-15",
  status: "active",
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [job, setJob] = useState(mockJob)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDeleteJob = () => {
    // In a real app, this would be an API call
    toast({
      title: "Job deleted",
      description: "The job listing has been successfully deleted.",
    })
    router.push("/admin/jobs")
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
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
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
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteJob}>
                  Delete
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

