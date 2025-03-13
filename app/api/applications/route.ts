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
      // Students can see their own applications
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
                  logo: true,
                },
              },
            },
          },
        },
        orderBy: {
          appliedDate: "desc",
        },
      })

      return NextResponse.json(applications)
    } else if (user.role === "ORGANIZATION") {
      // Organizations can see applications to their job offers
      const applications = await prisma.application.findMany({
        where: {
          jobOffer: {
            organizationId: user.organizationId,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              profile: {
                select: {
                  passingYear: true,
                  resumeUrl: true,
                  address: true,
                },
              },
            },
          },
          jobOffer: {
            select: {
              id: true,
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

      return NextResponse.json(applications)
    } else {
      // Admin can see all applications
      const applications = await prisma.application.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              profile: {
                select: {
                  passingYear: true,
                  resumeUrl: true,
                  address: true,
                },
              },
            },
          },
          jobOffer: {
            include: {
              organization: {
                select: {
                  name: true,
                  logo: true,
                },
              },
            },
          },
        },
        orderBy: {
          appliedDate: "desc",
        },
      })

      return NextResponse.json(applications)
    }
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ message: "An error occurred while fetching applications" }, { status: 500 })
  }
}

export async function POST(req: Request) {
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

    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ message: "Only students can apply for jobs" }, { status: 403 })
    }

    const body = await req.json()
    const { jobOfferId, resumeUrl, coverLetter } = body

    if (!jobOfferId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if job offer exists
    const jobOffer = await prisma.jobOffer.findUnique({
      where: {
        id: jobOfferId,
      },
    })

    if (!jobOffer) {
      return NextResponse.json({ message: "Job offer not found" }, { status: 404 })
    }

    // Check if user has already applied for this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: user.id,
        jobOfferId: jobOfferId,
      },
    })

    if (existingApplication) {
      return NextResponse.json({ message: "You have already applied for this job" }, { status: 409 })
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        jobOfferId: jobOfferId,
        resumeUrl: resumeUrl || null,
        coverLetter: coverLetter || null,
        status: "PENDING",
      },
    })

    // Update user profile with resume URL if provided
    if (resumeUrl) {
      const profile = await prisma.profile.findUnique({
        where: {
          userId: user.id,
        },
      })

      if (profile) {
        await prisma.profile.update({
          where: {
            userId: user.id,
          },
          data: {
            resumeUrl,
          },
        })
      } else {
        await prisma.profile.create({
          data: {
            userId: user.id,
            resumeUrl,
          },
        })
      }
    }

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ message: "An error occurred while submitting your application" }, { status: 500 })
  }
}

