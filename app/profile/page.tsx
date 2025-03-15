"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import {
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Edit,
  Save,
  Plus,
  Trash2,
} from "lucide-react"

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, San Francisco, CA 94105",
  bio: "Computer Science student with a passion for web development and AI. Looking for opportunities to grow and learn in a collaborative environment.",
  education: [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University",
      year: "2020-2024",
    },
  ],
  experience: [
    {
      id: 1,
      position: "Web Development Intern",
      company: "Tech Innovators",
      duration: "Summer 2023",
      description: "Worked on frontend development using React and Next.js",
    },
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "UI/UX Design"],
}

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter your complete address." }),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters." }).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const educationFormSchema = z.object({
  degree: z.string().min(2, { message: "Degree must be at least 2 characters." }),
  institution: z.string().min(2, { message: "Institution must be at least 2 characters." }),
  year: z.string().min(4, { message: "Please enter a valid year range." }),
})

type EducationFormValues = z.infer<typeof educationFormSchema>

const experienceFormSchema = z.object({
  position: z.string().min(2, { message: "Position must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company must be at least 2 characters." }),
  duration: z.string().min(2, { message: "Duration must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
})

type ExperienceFormValues = z.infer<typeof experienceFormSchema>

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(userData)
  const [addingEducation, setAddingEducation] = useState(false)
  const [addingExperience, setAddingExperience] = useState(false)

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
    },
  })

  // Education form
  const educationForm = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      degree: "",
      institution: "",
      year: "",
    },
  })

  // Experience form
  const experienceForm = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      position: "",
      company: "",
      duration: "",
      description: "",
    },
  })

  function onProfileSubmit(data: ProfileFormValues) {
    setUser({ ...user, ...data })
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  function onEducationSubmit(data: EducationFormValues) {
    const newEducation = {
      id: user.education.length + 1,
      ...data,
    }
    setUser({ ...user, education: [...user.education, newEducation] })
    setAddingEducation(false)
    educationForm.reset()
    toast({
      title: "Education added",
      description: "Your education information has been added successfully.",
    })
  }

  function onExperienceSubmit(data: ExperienceFormValues) {
    const newExperience = {
      id: user.experience.length + 1,
      ...data,
    }
    setUser({ ...user, experience: [...user.experience, newExperience] })
    setAddingExperience(false)
    experienceForm.reset()
    toast({
      title: "Experience added",
      description: "Your experience information has been added successfully.",
    })
  }

  function deleteEducation(id: number) {
    setUser({ ...user, education: user.education.filter((edu) => edu.id !== id) })
    toast({
      title: "Education removed",
      description: "Your education information has been removed.",
    })
  }

  function deleteExperience(id: number) {
    setUser({ ...user, experience: user.experience.filter((exp) => exp.id !== id) })
    toast({
      title: "Experience removed",
      description: "Your experience information has been removed.",
    })
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src="/placeholder.svg?height=128&width=128" alt={user.name} />
            <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            Change Photo
          </Button>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                Cancel
              </Button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">{user.bio}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.address}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Your address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself"
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Brief description about yourself. This will be visible to employers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>

      <Tabs defaultValue="education" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
        </TabsList>

        <TabsContent value="education" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Education
            </h2>
            {!addingEducation && (
              <Button onClick={() => setAddingEducation(true)} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            )}
          </div>

          {addingEducation && (
            <Card>
              <CardHeader>
                <CardTitle>Add Education</CardTitle>
                <CardDescription>Add your educational background</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...educationForm}>
                  <form
                    id="education-form"
                    onSubmit={educationForm.handleSubmit(onEducationSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={educationForm.control}
                      name="degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree/Certificate</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Bachelor of Science in Computer Science" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={educationForm.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Stanford University" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={educationForm.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2020-2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setAddingEducation(false)}>
                  Cancel
                </Button>
                <Button type="submit" form="education-form">
                  Save
                </Button>
              </CardFooter>
            </Card>
          )}

          {user.education.length > 0 ? (
            <div className="space-y-4">
              {user.education.map((edu) => (
                <Card key={edu.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          {edu.institution}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Calendar className="mr-2 h-4 w-4" />
                          {edu.year}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={() => deleteEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <GraduationCap className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No education information added yet.</p>
                <Button onClick={() => setAddingEducation(true)} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="experience" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              Experience
            </h2>
            {!addingExperience && (
              <Button onClick={() => setAddingExperience(true)} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            )}
          </div>

          {addingExperience && (
            <Card>
              <CardHeader>
                <CardTitle>Add Experience</CardTitle>
                <CardDescription>Add your work experience</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...experienceForm}>
                  <form
                    id="experience-form"
                    onSubmit={experienceForm.handleSubmit(onExperienceSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={experienceForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Web Development Intern" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={experienceForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Tech Innovators" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={experienceForm.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Summer 2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={experienceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your responsibilities and achievements"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setAddingExperience(false)}>
                  Cancel
                </Button>
                <Button type="submit" form="experience-form">
                  Save
                </Button>
              </CardFooter>
            </Card>
          )}

          {user.experience.length > 0 ? (
            <div className="space-y-4">
              {user.experience.map((exp) => (
                <Card key={exp.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{exp.position}</h3>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Briefcase className="mr-2 h-4 w-4" />
                          {exp.company}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Calendar className="mr-2 h-4 w-4" />
                          {exp.duration}
                        </div>
                        <p className="mt-2 text-sm">{exp.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={() => deleteExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Briefcase className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No experience information added yet.</p>
                <Button onClick={() => setAddingExperience(true)} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resume" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Resume
            </h2>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Upload Resume
            </Button>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No resume uploaded yet.</p>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                Upload your resume to make it easier for employers to review your qualifications. Supported formats:
                PDF, DOCX (Max size: 5MB)
              </p>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

