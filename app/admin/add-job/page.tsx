"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobForm } from "@/components/job-form"

export default function AddJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Add New Job</h1>
        <p className="text-muted-foreground">Create a new job listing for your organization</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Fill in the details for the new job listing. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm />
        </CardContent>
      </Card>
    </div>
  )
}

