import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get the user with their password
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        password: true,
      },
    })

    if (!user || !user.password) {
      return NextResponse.json({ message: "User not found or no password set" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ message: "An error occurred while updating password" }, { status: 500 })
  }
}

