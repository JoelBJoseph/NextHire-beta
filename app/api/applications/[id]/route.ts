import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const applicationId = params.id

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
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

    // Check if user has permission to view this application
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Students can only view their own applications
    if (user.role === "STUDENT" && application.userId !== user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Organizations can only view applications for their job offers
    if (user.role === "ORGANIZATION") {
      const jobOffer = await prisma.jobOffer.findUnique({
        where: {
          id: application.jobOfferId,
        },
      })

      if (!jobOffer || jobOffer.organizationId !== user.organizationId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
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

    const applicationId = params.id
    const body = await req.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if application exists
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        jobOffer: true,
      },
    })

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Check if user has permission to update this application
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Only admins and organization users can update application status
    if (user.role === "STUDENT") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Organizations can only update applications for their job offers
    if (user.role === "ORGANIZATION") {
      if (application.jobOffer.organizationId !== user.organizationId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
      }
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status,
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const applicationId = params.id

    // Check if application exists
    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    })

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 })
    }

    // Check if user has permission to delete this application
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Students can only delete their own applications
    if (user.role === "STUDENT" && application.userId !== user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Organizations can only delete applications for their job offers
    if (user.role === "ORGANIZATION") {
      const jobOffer = await prisma.jobOffer.findUnique({
        where: {
          id: application.jobOfferId,
        },
      })

      if (!jobOffer || jobOffer.organizationId !== user.organizationId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
      }
    }

    // Delete application
    await prisma.application.delete({
      where: {
        id: applicationId,
      },
    })

    return NextResponse.json({
      message: "Application deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json({ message: "An error occurred while deleting the application" }, { status: 500 })
  }
}

