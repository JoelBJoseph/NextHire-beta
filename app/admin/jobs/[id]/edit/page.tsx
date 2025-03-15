"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobForm } from "@/components/job-form"
import { useParams } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock job data
const mockJob = {
  id: "1",
  title: "Software Engineer",
  description:
    "We are looking for a skilled software engineer to join our team. The ideal candidate will have experience with React, Node.js, and TypeScript.",
  location: "San Francisco, CA",
  salary: "$80,000 - $120,000",
  type: "Full-time",
  experience: "3+ years",
  skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
  createdAt: "2023-07-15",
  status: "active",
}

export default function EditJobPage() {
  const params = useParams()
  const jobId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [job, setJob] = useState(mockJob)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <LoadingSpinner size="md" className="text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Job</h1>
        <p className="text-muted-foreground">Update the details for this job listing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Edit the details for the job listing. Fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm initialData={job} isEditing />
        </CardContent>
      </Card>
    </div>
  )
}

