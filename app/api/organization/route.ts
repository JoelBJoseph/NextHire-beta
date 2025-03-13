import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an organization or admin
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        organization: true,
      },
    })

    if (!user || (user.role !== "ORGANIZATION" && user.role !== "ADMIN")) {
      return NextResponse.json({ message: "Only organizations or admins can access this endpoint" }, { status: 403 })
    }

    if (!user.organization) {
      return NextResponse.json({ message: "Organization not found" }, { status: 404 })
    }

    return NextResponse.json(user.organization)
  } catch (error) {
    console.error("Error fetching organization:", error)
    return NextResponse.json({ message: "An error occurred while fetching organization data" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an organization or admin
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        organization: true,
      },
    })

    if (!user || (user.role !== "ORGANIZATION" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { message: "Only organizations or admins can update organization data" },
        { status: 403 },
      )
    }

    if (!user.organization) {
      return NextResponse.json({ message: "Organization not found" }, { status: 404 })
    }

    const body = await req.json()
    const { name, industry, location, description, website } = body

    if (!name) {
      return NextResponse.json({ message: "Organization name is required" }, { status: 400 })
    }

    const updatedOrganization = await prisma.organization.update({
      where: {
        id: user.organization.id,
      },
      data: {
        name,
        industry,
        location,
        description,
        website,
      },
    })

    return NextResponse.json({
      message: "Organization updated successfully",
      organization: updatedOrganization,
    })
  } catch (error) {
    console.error("Error updating organization:", error)
    return NextResponse.json({ message: "An error occurred while updating organization data" }, { status: 500 })
  }
}

