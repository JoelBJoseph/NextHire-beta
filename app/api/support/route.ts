import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function POST(req: Request) {
  try {
    const session = await getSession()
    const body = await req.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would send an email or store the support request in a database
    console.log("Support request:", {
      name,
      email,
      message,
      userId: session?.user?.id || "anonymous",
    })

    // For now, we'll just return a success response
    return NextResponse.json(
      {
        message: "Support request sent successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error processing support request:", error)
    return NextResponse.json({ message: "An error occurred while processing your request" }, { status: 500 })
  }
}

