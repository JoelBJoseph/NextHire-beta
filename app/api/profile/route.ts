import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // First, check if the profile exists
    let profile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        education: true,
        experience: true,
      },
    })

    // If profile doesn't exist, create a new one
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          bio: null,
          phone: null,
          address: null,
          skills: [],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          education: true,
          experience: true,
        },
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ message: "An error occurred while fetching the profile" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { bio, phone, address, skills } = body

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    let updatedProfile

    if (existingProfile) {
      // Update existing profile
      updatedProfile = await prisma.profile.update({
        where: {
          userId: session.user.id,
        },
        data: {
          bio,
          phone,
          address,
          skills,
        },
      })
    } else {
      // Create new profile
      updatedProfile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          bio,
          phone,
          address,
          skills: skills || [],
        },
      })
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ message: "An error occurred while updating the profile" }, { status: 500 })
  }
}

