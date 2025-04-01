"use client"

import type React from "react"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useRouter } from "next/navigation"
import { createApplication } from "@/lib/api"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Please enter a valid phone number.",
    }),
    address: z.string().min(5, {
        message: "Please enter your complete address.",
    }),
    education: z.string().min(2, {
        message: "Please enter your education details.",
    }),
    experience: z.string().optional(),
    coverLetter: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function JobApplicationForm({ jobId }: { jobId: string | number }) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [fileError, setFileError] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            education: "",
            experience: "",
            coverLetter: "",
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setFileError(null)

        if (!file) {
            setFileError("Resume is required.")
            setResumeFile(null)
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            setFileError("File size must be less than 5MB.")
            setResumeFile(null)
            return
        }

        if (file.type !== "application/pdf") {
            setFileError("Only PDF files are accepted.")
            setResumeFile(null)
            return
        }

        setResumeFile(file)
    }

    async function onSubmit(data: FormValues) {
        if (!resumeFile) {
            setFileError("Resume is required.")
            return
        }

        try {
            setIsSubmitting(true)

            // In a real app, we would upload the resume to a storage service
            // and get a URL back. For now, we'll just use a placeholder URL
            const resumeUrl = "https://example.com/resume.pdf"

            // Submit the application
            await createApplication({
                jobOfferId: jobId.toString(),
                resumeUrl,
                coverLetter: data.coverLetter,
            })

            toast({
                title: "Application submitted",
                description: "Your application has been submitted successfully.",
            })

            setIsSuccess(true)
            form.reset()
            setResumeFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ""

            // Refresh dashboard to show the new application
            router.refresh()
        } catch (error) {
            console.error("Error submitting application:", error)
            toast({
                title: "Error",
                description: "Failed to submit your application. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                    <svg
                        className="w-8 h-8 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Thank you for your application. We'll review it and get back to you soon.
                </p>
                <Button onClick={() => setIsSuccess(false)}>Submit Another Application</Button>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
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
                                    <Input type="email" placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+1 (555) 123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="education"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Education</FormLabel>
                                <FormControl>
                                    <Input placeholder="Bachelor's in Computer Science" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="123 Main St, City, State, Zip" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Brief description of your relevant experience"
                                    className="min-h-[80px]"
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <FormLabel htmlFor="resume">Resume (PDF)</FormLabel>
                    <Input id="resume" ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} />
                    {fileError && <p className="text-sm font-medium text-destructive">{fileError}</p>}
                    {resumeFile && (
                        <p className="text-sm text-muted-foreground">
                            Selected file: {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                    )}
                    <FormDescription>Upload your resume in PDF format (max 5MB).</FormDescription>
                </div>

                <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cover Letter (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Why you're interested in this position..."
                                    className="min-h-[80px]"
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <LoadingSpinner size="sm" className="mr-2" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Application"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

