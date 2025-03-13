import { mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function initUploadsDirectory() {
  const uploadsDir = join(process.cwd(), "public", "uploads")

  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true })
    console.log("Created uploads directory")
  }
}

