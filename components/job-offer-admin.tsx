"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Users, MapPin, Building, DollarSign, Clock, Edit, FileText } from "lucide-react"

interface Student {
  id: number
  name: string
  email: string
  education: string
  experience: string
}

interface JobOffer {
  id: number
  title: string
  company: string
  location: string
  salary: string
  description: string
  students: Student[]
}

interface JobOfferAdminProps {
  offer: JobOffer
  onDelete: () => void
}

export function JobOfferAdmin({ offer, onDelete }: JobOfferAdminProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{offer.title}</CardTitle>
            <CardDescription className="flex items-center text-base">
              <Building className="mr-2 h-4 w-4" />
              {offer.company}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{offer.location}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{offer.salary}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Full-time</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Applications ({offer.students.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Applications for {offer.title}</DialogTitle>
                <DialogDescription>Review all applications for this position</DialogDescription>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Education</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offer.students.map((student) => (
                    <TableRow
                      key={student.id}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.education}</TableCell>
                      <TableCell>{student.experience}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {selectedStudent && (
                <div className="mt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-sm font-medium">Resume:</div>
                    <div className="col-span-3">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Resume
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}

