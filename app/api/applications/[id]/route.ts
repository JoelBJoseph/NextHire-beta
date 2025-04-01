import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const application = await prisma.application.findUnique({
      where: {
        id: params.id,
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
    })

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Check if user is authorized to view this application
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        organization: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Students can only view their own applications
    if (user.role === "STUDENT" && application.userId !== user.id) {
      return NextResponse.json({ message: "You don't have permission to view this application" }, { status: 403 })
    }

    // Organizations can only view applications for their job offers
    if (user.role === "ORGANIZATION" && user.organization) {
      const jobOffer = await prisma.jobOffer.findUnique({
        where: {
          id: application.jobOfferId,
        },
      })

      if (!jobOffer || jobOffer.organizationId !== user.organization.id) {
        return NextResponse.json({ message: "You don't have permission to view this application" }, { status: 403 })
      }
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json({ message: "An error occurred while fetching the application" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const application = await prisma.application.findUnique({
      where: {
        id: params.id,
      },
      include: {
        jobOffer: {
          include: {
            organization: true,
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Check if user is authorized to update this application
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        organization: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Only organization owners or admins can update application status
    if (
      user.role !== "ADMIN" &&
      (user.role !== "ORGANIZATION" ||
        !user.organization ||
        application.jobOffer.organizationId !== user.organization.id)
    ) {
      return NextResponse.json({ message: "You don't have permission to update this application" }, { status: 403 })
    }

    const body = await req.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: {
        id: params.id,
      },
      data: {
        status: status,
      },
    })

    // Create notification for the student
    await prisma.notification.create({
      data: {
        userId: application.userId,
        message: `Your application for ${application.jobOffer.title} has been ${status.toLowerCase()}.`,
      },
    })

    return NextResponse.json({
      message: "Application status updated successfully",
      application: updatedApplication,
    })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json({ message: "An error occurred while updating the application" }, { status: 500 })
  }
}

