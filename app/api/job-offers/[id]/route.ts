import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const jobOffer = await prisma.jobOffer.findUnique({
      where: {
        id: params.id,
      },
      include: {
        organization: {
          select: {
            name: true,
            logo: true,
            website: true,
            industry: true,
          },
        },
      },
    })

    if (!jobOffer) {
      return NextResponse.json({ message: "Job offer not found" }, { status: 404 })
    }

    return NextResponse.json(jobOffer)
  } catch (error) {
    console.error("Error fetching job offer:", error)
    return NextResponse.json({ message: "An error occurred while fetching the job offer" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an organization and owns this job offer
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        organization: {
          include: {
            jobOffers: {
              where: {
                id: params.id,
              },
            },
          },
        },
      },
    })

    if (!user || user.role !== "ORGANIZATION" || !user.organization || user.organization.jobOffers.length === 0) {
      return NextResponse.json({ message: "You don't have permission to update this job offer" }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, location, salary, type, experience, skills } = body

    if (!title || !description || !location) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const updatedJobOffer = await prisma.jobOffer.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        location,
        salary,
        type,
        experience,
        skills,
      },
    })

    return NextResponse.json({
      message: "Job offer updated successfully",
      jobOffer: updatedJobOffer,
    })
  } catch (error) {
    console.error("Error updating job offer:", error)
    return NextResponse.json({ message: "An error occurred while updating the job offer" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an organization and owns this job offer
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        organization: {
          include: {
            jobOffers: {
              where: {
                id: params.id,
              },
            },
          },
        },
      },
    })

    if (!user || user.role !== "ORGANIZATION" || !user.organization || user.organization.jobOffers.length === 0) {
      return NextResponse.json({ message: "You don't have permission to delete this job offer" }, { status: 403 })
    }

    await prisma.jobOffer.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      message: "Job offer deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting job offer:", error)
    return NextResponse.json({ message: "An error occurred while deleting the job offer" }, { status: 500 })
  }
}

