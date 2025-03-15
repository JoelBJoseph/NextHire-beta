import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // In a real app, this would send an email or store the message in a database
    console.log("Contact form submission:", { name, email, subject, message })

    // For now, we'll just return a success response
    return NextResponse.json(
      {
        message: "Message sent successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ message: "An error occurred while processing your message" }, { status: 500 })
  }
}

