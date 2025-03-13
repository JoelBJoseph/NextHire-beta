"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  address: z.string().min(5, {
    message: "Please provide your complete address.",
  }),
  passingYear: z.string().regex(/^\d{4}$/, {
    message: "Please enter a valid year (YYYY).",
  }),
  resume: z.string().min(1, {
    message: "Please upload your resume.",
  }),
})

export function JobApplicationForm({ jobId }: { jobId: number }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      passingYear: "",
      resume: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Create a FormData object to handle file upload
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("email", values.email)
      formData.append("address", values.address)
      formData.append("passingYear", values.passingYear)
      formData.append("jobId", jobId.toString())

      // Get the file from the input element
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append("resume", fileInput.files[0])
      }

      const response = await fetch("/api/applications/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit application")
      }

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })

      // Reset the form
      form.reset()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit your application. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Your complete address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passingYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passing Out Year</FormLabel>
                <FormControl>
                  <Input placeholder="YYYY" maxLength={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume (PDF only, max 5MB)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && file.size > MAX_FILE_SIZE) {
                        form.setError("resume", {
                          message: "File size must be less than 5MB",
                        })
                        return
                      }
                      field.onChange(e.target.files?.[0]?.name || "")
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  )
}

