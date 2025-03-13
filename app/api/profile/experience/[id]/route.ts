import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const experience = await prisma.experience.findUnique({
      where: {
        id: params.id,
      },
      include: {
        profile: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!experience) {
      return NextResponse.json({ message: "Experience not found" }, { status: 404 })
    }

    if (experience.profile.userId !== session.user.id) {
      return NextResponse.json({ message: "You don't have permission to update this experience" }, { status: 403 })
    }

    const body = await req.json()
    const { position, company, duration, description } = body

    if (!position || !company || !duration || !description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const updatedExperience = await prisma.experience.update({
      where: {
        id: params.id,
      },
      data: {
        position,
        company,
        duration,
        description,
      },
    })

    return NextResponse.json({
      message: "Experience updated successfully",
      experience: updatedExperience,
    })
  } catch (error) {
    console.error("Error updating experience:", error)
    return NextResponse.json({ message: "An error occurred while updating experience" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const experience = await prisma.experience.findUnique({
      where: {
        id: params.id,
      },
      include: {
        profile: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!experience) {
      return NextResponse.json({ message: "Experience not found" }, { status: 404 })
    }

    if (experience.profile.userId !== session.user.id) {
      return NextResponse.json({ message: "You don't have permission to delete this experience" }, { status: 403 })
    }

    await prisma.experience.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      message: "Experience deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting experience:", error)
    return NextResponse.json({ message: "An error occurred while deleting experience" }, { status: 500 })
  }
}

