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
    const { degree, institution, year } = body

    if (!degree || !institution || !year) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const education = await prisma.education.create({
      data: {
        degree,
        institution,
        year,
        profile: {
          connect: {
            id: profile.id,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "Education added successfully",
        education,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error adding education:", error)
    return NextResponse.json({ message: "An error occurred while adding education" }, { status: 500 })
  }
}

