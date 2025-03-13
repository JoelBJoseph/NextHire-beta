"use client"

import { useState, useEffect } from "react"
import { JobOfferCard } from "@/components/job-offer-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Briefcase } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function OffersPage() {
  const [jobOffers, setJobOffers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchJobOffers() {
      try {
        const response = await fetch("/api/job-offers")
        if (!response.ok) {
          throw new Error("Failed to fetch job offers")
        }
        const data = await response.json()
        setJobOffers(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load job offers. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobOffers()
  }, [])

  const filteredJobOffers = jobOffers.filter(
    (offer) =>
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Add a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-blue-600 dark:bg-blue-700 py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Your Dream Job</h1>
            <p className="text-blue-100 mb-8">
              Discover exciting opportunities that match your skills and qualifications as a student
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  className="pl-10 bg-white dark:bg-gray-800 h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Latest Opportunities</h2>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Sort</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobOffers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No job offers found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try a different search term" : "Check back later for new opportunities"}
              </p>
            </div>
          ) : (
            filteredJobOffers.map((offer) => <JobOfferCard key={offer.id} offer={offer} />)
          )}
        </div>
      </div>
    </div>
  )
}

