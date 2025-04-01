"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { getJobOffers, deleteJobOffer } from "@/lib/api"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  applications: number
  createdAt: string
  status: string
}

export default function JobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        setIsLoading(true)
        const data = await getJobOffers()

        // Transform the data to match our Job interface
        const formattedJobs = Array.isArray(data)
            ? data.map((job) => ({
              id: job.id || "",
              title: job.title || "Untitled Job",
              company: job.organization?.name || "Unknown Company",
              location: job.location || "Remote",
              type: job.type || "Full-time",
              applications: Array.isArray(job.applications) ? job.applications.length : 0,
              createdAt: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Unknown date",
              status: job.status || "active",
            }))
            : []

        setJobs(formattedJobs)
      } catch (err) {
        setError("Failed to load job listings. Please try again later.")
        console.error("Error fetching job listings:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const filteredJobs = jobs.filter(
      (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteJob = (id: string) => {
    setDeleteJobId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteJob = async () => {
    if (deleteJobId) {
      try {
        setIsDeleting(true)
        await deleteJobOffer(deleteJobId)
        setJobs(jobs.filter((job) => job.id !== deleteJobId))
        toast({
          title: "Job deleted",
          description: "The job listing has been successfully deleted.",
        })
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete the job listing. Please try again.",
          variant: "destructive",
        })
        console.error("Error deleting job:", err)
      } finally {
        setIsDeleteDialogOpen(false)
        setDeleteJobId(null)
        setIsDeleting(false)
      }
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
      default:
        return <Badge>{status}</Badge>
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

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Job Listings</h1>
          <p className="text-muted-foreground">Manage your organization's job listings</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <CardTitle>All Job Listings</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                      type="search"
                      placeholder="Search jobs..."
                      className="pl-8 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Link href="/admin/add-job">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Job
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No job listings found
                        </TableCell>
                      </TableRow>
                  ) : (
                      filteredJobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell>
                              <div className="font-medium">{job.title}</div>
                              <div className="text-sm text-muted-foreground">{job.company}</div>
                            </TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>{job.type}</TableCell>
                            <TableCell>{job.applications}</TableCell>
                            <TableCell>{job.createdAt}</TableCell>
                            <TableCell>{getStatusBadge(job.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => router.push(`/admin/jobs/${job.id}`)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteJob(job.id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              <Button variant="destructive" onClick={confirmDeleteJob} disabled={isDeleting}>
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
  )
}

