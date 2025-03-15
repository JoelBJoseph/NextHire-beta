"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Search } from "lucide-react"
import { submitSupportRequest } from "@/lib/api"

// FAQ data - this could be fetched from an API in a real application
const faqs = [
  {
    question: "How do I post a new job?",
    answer:
      "To post a new job, navigate to the 'Job Listings' page and click on the 'Add New Job' button. Fill in the required details about the job position and click 'Create Job' to publish it.",
  },
  {
    question: "How can I view applications for my job listings?",
    answer:
      "You can view all applications by clicking on the 'Applications' link in the sidebar. You can filter applications by status (pending, selected, rejected) and search for specific candidates.",
  },
  {
    question: "How do I update my organization information?",
    answer:
      "To update your organization information, go to the 'Settings' page and select the 'Organization' tab. Here you can edit your organization's name, industry, location, description, and website.",
  },
  {
    question: "Can I download resumes of applicants?",
    answer:
      "Yes, you can download resumes of applicants. When viewing an application, click on the 'View Resume' button and then use the download option in the resume viewer.",
  },
  {
    question: "How do I change the status of an application?",
    answer:
      "To change the status of an application, go to the 'Applications' page, find the application you want to update, and click on the 'View' button. In the application details dialog, you can change the status using the dropdown menu.",
  },
  {
    question: "Can I edit a job listing after it's published?",
    answer:
      "Yes, you can edit a job listing after it's published. Go to the 'Job Listings' page, find the job you want to edit, and click on the 'Edit' button or select 'Edit' from the actions menu.",
  },
  {
    question: "How do I close a job listing?",
    answer:
      "To close a job listing, go to the 'Job Listings' page, find the job you want to close, click on the 'Edit' button, and change the status to 'Closed'. You can also reopen it later if needed.",
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitSupportRequest({
        name: contactName,
        email: contactEmail,
        message: contactMessage,
      })

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully. We'll get back to you soon.",
      })

      // Reset form
      setContactName("")
      setContactEmail("")
      setContactMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again later.",
        variant: "destructive",
      })
      console.error("Error submitting support request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">Find answers to common questions or contact our support team</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about using the platform</CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">
                  No FAQs found matching your search. Try a different search term or contact support.
                </p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Can&#39;t find what you&#39;re looking for? Send us a message and we'll get back to you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we help?"
                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

