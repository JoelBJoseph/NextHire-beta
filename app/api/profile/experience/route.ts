import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    if (!profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 })
    }

    const body = await req.json()
    const { position, company, duration, description } = body

    if (!position || !company || !duration || !description) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const experience = await prisma.experience.create({
      data: {
        position,
        company,
        duration,
        description,
        profile: {
          connect: {
            id: profile.id,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "Experience added successfully",
        experience,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding experience:", error)
    return NextResponse.json({ message: "An error occurred while adding experience" }, { status: 500 })
  }
}

