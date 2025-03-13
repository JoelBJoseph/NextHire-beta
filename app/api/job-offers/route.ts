import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || ""
    const location = searchParams.get("location") || ""
    const type = searchParams.get("type") || ""

    const jobOffers = await prisma.jobOffer.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
        ...(location
          ? {
              location: {
                contains: location,
                mode: "insensitive",
              },
            }
          : {}),
        ...(type
          ? {
              type: {
                equals: type,
              },
            }
          : {}),
      },
      include: {
        organization: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(jobOffers)
  } catch (error) {
    console.error("Error fetching job offers:", error)
    return NextResponse.json({ message: "An error occurred while fetching job offers" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an organization
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        organization: true,
      },
    })

    if (!user || user.role !== "ORGANIZATION" || !user.organization) {
      return NextResponse.json({ message: "Only organizations can create job offers" }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, location, salary, type, experience, skills } = body

    if (!title || !description || !location) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const jobOffer = await prisma.jobOffer.create({
      data: {
        title,
        description,
        location,
        salary,
        type: type || "Full-time",
        experience,
        skills,
        organization: {
          connect: {
            id: user.organization.id,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "Job offer created successfully",
        jobOffer,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating job offer:", error)
    return NextResponse.json({ message: "An error occurred while creating the job offer" }, { status: 500 })
  }
}

