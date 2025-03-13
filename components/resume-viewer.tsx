"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"

interface ResumeViewerProps {
  resumeUrl: string
  studentName: string
  trigger?: React.ReactNode
}

export function ResumeViewer({ resumeUrl, studentName, trigger }: ResumeViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(1)

  // This would normally load the actual PDF, but for demo purposes we're using a placeholder
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            View Resume
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{studentName}'s Resume</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.5}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom >= 2}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={currentPage <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage >= totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 rounded-md p-4 flex items-center justify-center">
            <div
              className="bg-white dark:bg-gray-700 shadow-lg rounded-md overflow-hidden"
              style={{
                width: `${8.5 * zoom}in`,
                height: `${11 * zoom}in`,
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
              }}
            >
              <div className="p-8 h-full flex flex-col">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">{studentName}</h2>
                  <p className="text-gray-500 dark:text-gray-400">student@example.com | (555) 123-4567</p>
                  <p className="text-gray-500 dark:text-gray-400">123 University Ave, College Town, ST 12345</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold border-b pb-1 mb-2">Education</h3>
                  <div className="mb-2">
                    <div className="flex justify-between">
                      <p className="font-semibold">Bachelor of Science in Computer Science</p>
                      <p>2020 - 2024</p>
                    </div>
                    <p>Stanford University, Stanford, CA</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">GPA: 3.8/4.0</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold border-b pb-1 mb-2">Experience</h3>
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <p className="font-semibold">Software Engineering Intern</p>
                      <p>Summer 2023</p>
                    </div>
                    <p className="italic">Tech Innovators, San Francisco, CA</p>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li>Developed and maintained web applications using React and Node.js</li>
                      <li>Collaborated with a team of 5 engineers to implement new features</li>
                      <li>Improved application performance by 30% through code optimization</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold border-b pb-1 mb-2">Skills</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="font-semibold">Programming Languages:</p>
                      <p className="text-sm">JavaScript, Python, Java, C++</p>
                    </div>
                    <div>
                      <p className="font-semibold">Frameworks & Libraries:</p>
                      <p className="text-sm">React, Node.js, Express, Django</p>
                    </div>
                    <div>
                      <p className="font-semibold">Tools & Technologies:</p>
                      <p className="text-sm">Git, Docker, AWS, MongoDB</p>
                    </div>
                    <div>
                      <p className="font-semibold">Soft Skills:</p>
                      <p className="text-sm">Team Collaboration, Problem Solving, Communication</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold border-b pb-1 mb-2">Projects</h3>
                  <div className="mb-2">
                    <p className="font-semibold">Personal Portfolio Website</p>
                    <p className="text-sm">
                      Designed and developed a responsive personal portfolio website using React and Tailwind CSS
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">E-commerce Platform</p>
                    <p className="text-sm">
                      Built a full-stack e-commerce platform with user authentication, product catalog, and payment
                      processing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

