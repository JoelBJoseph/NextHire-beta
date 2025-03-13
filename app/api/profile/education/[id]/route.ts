import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const education = await prisma.education.findUnique({
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

    if (!education) {
      return NextResponse.json({ message: "Education not found" }, { status: 404 })
    }

    if (education.profile.userId !== session.user.id) {
      return NextResponse.json({ message: "You don't have permission to update this education" }, { status: 403 })
    }

    const body = await req.json()
    const { degree, institution, year } = body

    if (!degree || !institution || !year) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const updatedEducation = await prisma.education.update({
      where: {
        id: params.id,
      },
      data: {
        degree,
        institution,
        year,
      },
    })

    return NextResponse.json({
      message: "Education updated successfully",
      education: updatedEducation,
    })
  } catch (error) {
    console.error("Error updating education:", error)
    return NextResponse.json({ message: "An error occurred while updating education" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const education = await prisma.education.findUnique({
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

    if (!education) {
      return NextResponse.json({ message: "Education not found" }, { status: 404 })
    }

    if (education.profile.userId !== session.user.id) {
      return NextResponse.json({ message: "You don't have permission to delete this education" }, { status: 403 })
    }

    await prisma.education.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      message: "Education deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting education:", error)
    return NextResponse.json({ message: "An error occurred while deleting education" }, { status: 500 })
  }
}

