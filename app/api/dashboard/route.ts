import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Different queries based on user role
    if (user.role === "STUDENT") {
      // Student dashboard data
      const applications = await prisma.application.findMany({
        where: {
          userId: user.id,
        },
        include: {
          jobOffer: {
            include: {
              organization: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          appliedDate: "desc",
        },
      })

      const pendingApplications = applications.filter((app) => app.status === "PENDING").length
      const selectedApplications = applications.filter((app) => app.status === "SELECTED").length
      const rejectedApplications = applications.filter((app) => app.status === "REJECTED").length

      // Get recent notifications
      const notifications = await prisma.notification.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      })

      // Get upcoming events
      const events = await prisma.event.findMany({
        where: {
          date: {
            gte: new Date(),
          },
        },
        orderBy: {
          date: "asc",
        },
        take: 3,
      })

      // Format data for the frontend
      const recentApplications = applications.slice(0, 5).map((app) => ({
        id: app.id,
        jobTitle: app.jobOffer.title,
        company: app.jobOffer.organization.name,
        date: app.appliedDate.toISOString().split("T")[0],
        status: app.status.toLowerCase(),
      }))

      const upcomingEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date.toISOString().split("T")[0],
        time: event.time || "All day",
      }))

      const notificationsList = notifications.map((notification) => ({
        id: notification.id,
        message: notification.message,
        time: getTimeAgo(notification.createdAt),
      }))

      return NextResponse.json({
        totalApplications: applications.length,
        pendingApplications,
        selectedApplications,
        rejectedApplications,
        recentApplications,
        upcomingEvents,
        notifications: notificationsList,
      })
    } else if (user.role === "ORGANIZATION" || user.role === "ADMIN") {
      // Organization/Admin dashboard data
      const organizationId = user.role === "ORGANIZATION" ? user.organizationId : null

      // Query conditions for organization or admin
      const whereCondition =
        user.role === "ORGANIZATION" && organizationId
          ? {
              jobOffer: {
                organizationId,
              },
            }
          : {}

      const jobWhereCondition = user.role === "ORGANIZATION" && organizationId ? { organizationId } : {}

      // Get applications
      const applications = await prisma.application.findMany({
        where: whereCondition,
        include: {
          user: {
            select: {
              name: true,
            },
          },
          jobOffer: {
            select: {
              title: true,
              organization: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          appliedDate: "desc",
        },
      })

      // Get job offers
      const jobOffers = await prisma.jobOffer.findMany({
        where: jobWhereCondition,
      })

      // Get active job offers - we'll consider all jobs as active for now
      const activeJobs = jobOffers.length

      // Get total students
      const totalStudents = await prisma.user.count({
        where: {
          role: "STUDENT",
        },
      })

      // Get upcoming events
      const events = await prisma.event.findMany({
        where: {
          date: {
            gte: new Date(),
          },
        },
        orderBy: {
          date: "asc",
        },
        take: 3,
      })

      const pendingApplications = applications.filter((app) => app.status === "PENDING").length
      const selectedApplications = applications.filter((app) => app.status === "SELECTED").length
      const rejectedApplications = applications.filter((app) => app.status === "REJECTED").length

      // Format data for the frontend
      const recentApplications = applications.slice(0, 5).map((app) => ({
        id: app.id,
        studentName: app.user.name,
        jobTitle: app.jobOffer.title,
        date: app.appliedDate.toISOString().split("T")[0],
        status: app.status.toLowerCase(),
      }))

      const upcomingEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date.toISOString().split("T")[0],
        time: event.time || "All day",
      }))

      return NextResponse.json({
        totalApplications: applications.length,
        pendingApplications,
        selectedApplications,
        rejectedApplications,
        totalJobs: jobOffers.length,
        activeJobs,
        totalStudents,
        recentApplications,
        upcomingEvents,
      })
    }

    return NextResponse.json({ message: "Invalid user role" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ message: "An error occurred while fetching dashboard data" }, { status: 500 })
  }
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`
}

