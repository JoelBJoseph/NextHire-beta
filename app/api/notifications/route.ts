import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ message: "An error occurred while fetching notifications" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { userId, message } = body

    if (!userId || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user is an admin or organization
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })

    if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZATION")) {
      return NextResponse.json({ message: "Only admins or organizations can create notifications" }, { status: 403 })
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
      },
    })

    return NextResponse.json(
      {
        message: "Notification created successfully",
        notification,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ message: "An error occurred while creating the notification" }, { status: 500 })
  }
}

