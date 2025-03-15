import { JobOfferCard } from "@/components/job-offer-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Briefcase } from "lucide-react"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

interface SearchParams {
  search?: string
  location?: string
  type?: string
}

export default async function OffersPage({
                                           searchParams,
                                         }: {
  searchParams: SearchParams
}) {
  const { search, location, type } = searchParams

  // Fetch job offers from the database
  const jobOffers = await prisma.jobOffer.findMany({
    where: {
      ...(search
          ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
          : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(type ? { type: { equals: type } } : {}),
      // We'll remove the status filter for now until the schema is updated
      // status: "active" // Only show active job listings
    },
    include: {
      organization: {
        select: {
          name: true,
          logo: true,
        },
      },
      applications: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Format job offers for the frontend
  const formattedJobOffers = jobOffers.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.organization.name,
    location: job.location,
    salary: job.salary || "Not specified",
    description: job.description,
    logo: job.organization.logo || "/logo.png",
    type: job.type,
    experience: job.experience || "Not specified",
    skills: job.skills,
    applications: job.applications.length,
  }))

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
              <form action="/offers" className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                      type="text"
                      name="search"
                      placeholder="Search jobs..."
                      className="pl-10 bg-white dark:bg-gray-800 h-12"
                      defaultValue={search}
                  />
                </div>
                <Button type="submit" size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </form>
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
              <Button variant="outline" asChild>
                <a href="/offers?type=Full-time">Filter</a>
              </Button>
              <Button variant="outline">Sort</Button>
            </div>
          </div>

          {formattedJobOffers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500 mb-4">No job offers available at the moment.</p>
                <p className="text-gray-500">Please check back later for new opportunities.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedJobOffers.map((offer) => (
                    <JobOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
          )}
        </div>
      </div>
  )
}

