"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Plus, MoreHorizontal, Edit, Copy, Trash2, Users, Calendar, MapPin } from "lucide-react"
import { useState } from "react"

const jobs = [
  {
    id: 1,
    title: "Senior Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    status: "Active",
    applicants: 23,
    posted: "2024-01-10",
    description: "We're looking for a senior developer to join our engineering team...",
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    status: "Active",
    applicants: 15,
    posted: "2024-01-12",
    description: "Seeking an experienced product manager to drive product strategy...",
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "New York, NY",
    status: "Draft",
    applicants: 0,
    posted: "2024-01-15",
    description: "Join our design team to create exceptional user experiences...",
  },
]

const scoringMetrics = [
  {
    key: "interpersonalSkills",
    label: "Interpersonal Skills",
    description: "Communication, leadership, collaboration",
  },
  { key: "cognitiveAbilities", label: "Cognitive Abilities", description: "Analytical thinking, creativity, learning" },
  { key: "emotionalIntelligence", label: "Emotional Intelligence", description: "Self-awareness, social awareness" },
  {
    key: "professionalQualities",
    label: "Professional Qualities",
    description: "Work ethic, adaptability, entrepreneurship",
  },
  { key: "culturalFit", label: "Cultural Fit (Startup)", description: "Collaboration, innovation, autonomy" },
  { key: "technicalAptitude", label: "Technical Aptitude", description: "Problem-solving, tech learning, innovation" },
  { key: "lifeExperience", label: "Life Experience", description: "Personal growth, diverse perspectives" },
]

export default function JobsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    description: "",
    requirements: "",
    weights: {
      interpersonalSkills: 50,
      cognitiveAbilities: 50,
      emotionalIntelligence: 50,
      professionalQualities: 50,
      culturalFit: 50,
      technicalAptitude: 50,
      lifeExperience: 50,
    },
  })

  const handleCreateJob = () => {
    // In a real app, this would make an API call
    console.log("Creating job:", newJob)
    setIsCreateDialogOpen(false)
    setNewJob({
      title: "",
      department: "",
      location: "",
      description: "",
      requirements: "",
      weights: {
        interpersonalSkills: 50,
        cognitiveAbilities: 50,
        emotionalIntelligence: 50,
        professionalQualities: 50,
        culturalFit: 50,
        technicalAptitude: 50,
        lifeExperience: 50,
      },
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Draft":
        return "secondary"
      case "Closed":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Job Postings</h1>
      </header>

      <div className="flex-1 space-y-6 p-6 overflow-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Manage Job Postings</h2>
            <p className="text-muted-foreground">Create and manage job positions with custom scoring criteria</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Job Posting</DialogTitle>
                <DialogDescription>
                  Define job details and configure scoring criteria for candidate evaluation
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newJob.department}
                      onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                      placeholder="e.g. Engineering"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA or Remote"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements & Skills</Label>
                  <Textarea
                    id="requirements"
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                    placeholder="List required skills, experience, and qualifications..."
                    rows={3}
                  />
                </div>

                {/* Scoring Criteria */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Scoring Criteria Weights</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjust the importance of each metric for this role (0-100 scale)
                    </p>
                  </div>

                  <div className="space-y-4">
                    {scoringMetrics.map((metric) => (
                      <div key={metric.key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <Label className="font-medium">{metric.label}</Label>
                            <p className="text-xs text-muted-foreground">{metric.description}</p>
                          </div>
                          <span className="text-sm font-medium">
                            {newJob.weights[metric.key as keyof typeof newJob.weights]}
                          </span>
                        </div>
                        <Slider
                          value={[newJob.weights[metric.key as keyof typeof newJob.weights]]}
                          onValueChange={(value) =>
                            setNewJob({
                              ...newJob,
                              weights: { ...newJob.weights, [metric.key]: value[0] },
                            })
                          }
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateJob}>Create Job Posting</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Job Postings</CardTitle>
            <CardDescription>Manage your current job openings and their requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{job.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {job.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(job.status)}>{job.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        {job.applicants}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {job.posted}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Job
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            View Applicants
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Job Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Job Templates</CardTitle>
            <CardDescription>Pre-configured templates for common positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium">Software Engineer</h3>
                  <p className="text-sm text-muted-foreground mt-1">High technical aptitude, problem-solving focus</p>
                  <div className="flex justify-between items-center mt-3">
                    <Badge variant="secondary">Template</Badge>
                    <Button size="sm" variant="outline">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium">Product Manager</h3>
                  <p className="text-sm text-muted-foreground mt-1">Leadership and strategic thinking emphasis</p>
                  <div className="flex justify-between items-center mt-3">
                    <Badge variant="secondary">Template</Badge>
                    <Button size="sm" variant="outline">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-medium">Sales Representative</h3>
                  <p className="text-sm text-muted-foreground mt-1">Interpersonal skills and cultural fit priority</p>
                  <div className="flex justify-between items-center mt-3">
                    <Badge variant="secondary">Template</Badge>
                    <Button size="sm" variant="outline">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
