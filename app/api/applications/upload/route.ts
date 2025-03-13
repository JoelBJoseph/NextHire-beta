import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import prisma from "@/lib/prisma"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const address = formData.get("address") as string
    const passingYear = formData.get("passingYear") as string
    const jobId = formData.get("jobId") as string
    const resumeFile = formData.get("resume") as File

    if (!name || !email || !address || !passingYear || !jobId || !resumeFile) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if job offer exists
    const jobOffer = await prisma.jobOffer.findUnique({
      where: {
        id: jobId,
      },
    })

    if (!jobOffer) {
      return NextResponse.json({ message: "Job offer not found" }, { status: 404 })
    }

    // Check if user has already applied for this job
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: session.user.id,
        jobOfferId: jobId,
      },
    })

    if (existingApplication) {
      return NextResponse.json({ message: "You have already applied for this job" }, { status: 409 })
    }

    // Save the resume file
    const bytes = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a unique filename
    const filename = `${uuidv4()}-${resumeFile.name}`
    const path = join(process.cwd(), "public", "uploads", filename)

    await writeFile(path, buffer)
    const resumeUrl = `/uploads/${filename}`

    // Update user profile with the provided information
    await prisma.profile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        address,
        passingYear,
        resumeUrl,
      },
    })

    // Create application
    const application = await prisma.application.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        jobOffer: {
          connect: {
            id: jobId,
          },
        },
        resumeUrl,
      },
    })

    // Create notification for the organization
    await prisma.notification.create({
      data: {
        userId: jobOffer.organizationId,
        message: `New application received for ${jobOffer.title} from ${name}`,
      },
    })

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ message: "An error occurred while submitting your application" }, { status: 500 })
  }
}

