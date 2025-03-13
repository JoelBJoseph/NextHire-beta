"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Briefcase, ChevronDown, ChevronUp } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface JobOffer {
  id: string
  title: string
  description: string
  location: string
  salary: string | null
  type: string
  experience: string | null
  skills: string[]
  organization: {
    name: string
    logo: string | null
  }
}

const formSchema = z.object({
  resume: z.string().url({ message: "Please enter a valid URL." }),
})

function JobApplicationForm({ jobId }: { jobId: string }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobOfferId: jobId,
          resumeUrl: values.resume,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to submit application")
      }

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })

      // Close the dialog or show success state
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/resume.pdf" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  )
}

export function JobOfferCard({ offer }: { offer: JobOffer }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
      <Card
        className="h-full flex flex-col justify-between overflow-hidden border-2 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="relative pb-0">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
              <Image
                src={offer.organization.logo || "/placeholder.svg?height=48&width=48"}
                alt={offer.organization.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-xl mb-1 text-blue-600 dark:text-blue-400">{offer.title}</CardTitle>
              <CardDescription className="font-medium">{offer.organization.name}</CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              <MapPin className="h-3 w-3 mr-1" />
              {offer.location}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3 mr-1" />
              {offer.type}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              <Briefcase className="h-3 w-3 mr-1" />
              {offer.experience}
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-4 flex-grow">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Salary:</span> {offer.salary}
              </p>
              <div className="relative">
                <motion.p
                  initial={{ height: "60px", overflow: "hidden" }}
                  animate={{
                    height: isExpanded ? "auto" : "60px",
                    overflow: isExpanded ? "visible" : "hidden",
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  {offer.description}
                </motion.p>
                {offer.description.length > 150 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-6 text-xs text-blue-600 dark:text-blue-400 p-0"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        Show more
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {offer.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Apply Now</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Apply for {offer.title}</DialogTitle>
              </DialogHeader>
              <JobApplicationForm jobId={offer.id} />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

