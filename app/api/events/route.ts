import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ message: "An error occurred while fetching events" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ message: "Only admins can create events" }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, date, time, location } = body

    if (!title || !date) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        time,
        location,
      },
    })

    return NextResponse.json(
      {
        message: "Event created successfully",
        event,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ message: "An error occurred while creating the event" }, { status: 500 })
  }
}

