"use client"

import { useState, useCallback, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { createJobOffer, updateJobOffer } from "@/lib/api"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  salary: z.string().optional(),
  type: z.string({
    required_error: "Please select a job type.",
  }),
  experience: z.string().optional(),
  status: z.string().default("active"),
})

type JobFormValues = z.infer<typeof formSchema>

interface JobFormProps {
  initialData?: JobFormValues & { skills?: string[]; id?: string }
  isEditing?: boolean
}

export function JobForm({ initialData, isEditing = false }: JobFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skills, setSkills] = useState<string[]>(initialData?.skills || [])
  const [skillInput, setSkillInput] = useState("")

  // Initialize form with default values or initial data
  const defaultValues = useMemo(() => {
    return (
      initialData || {
        title: "",
        description: "",
        location: "",
        salary: "",
        type: "Full-time",
        experience: "",
        status: "active",
      }
    )
  }, [initialData])

  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const addSkill = useCallback(() => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills((prev) => [...prev, skillInput.trim()])
      setSkillInput("")
    }
  }, [skillInput, skills])

  const removeSkill = useCallback((skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }, [])

  const onSubmit = useCallback(
    async (values: JobFormValues) => {
      setIsSubmitting(true)

      try {
        const jobData = {
          ...values,
          skills,
        }

        if (isEditing && initialData?.id) {
          await updateJobOffer(initialData.id, jobData)
          toast({
            title: "Job updated",
            description: "Your job listing has been updated successfully.",
          })
        } else {
          await createJobOffer(jobData)
          toast({
            title: "Job created",
            description: "Your job listing has been created successfully.",
          })
        }

        router.push("/admin/jobs")
        router.refresh()
      } catch (error) {
        console.error("Error saving job:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again.",
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [isEditing, initialData, skills, router],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $80,000 - $100,000" {...field} />
                </FormControl>
                <FormDescription>Optional. Leave blank if you prefer not to disclose.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2+ years" {...field} />
                </FormControl>
                <FormDescription>Optional. Specify required experience level.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Set whether this job is active or closed for applications.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Skills Required</FormLabel>
          <div className="flex items-center gap-2 mt-2">
            <Input
              placeholder="e.g., React, Node.js"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addSkill()
                }
              }}
            />
            <Button type="button" onClick={addSkill}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/jobs")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update Job"
            ) : (
              "Create Job"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

