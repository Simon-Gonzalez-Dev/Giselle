"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Search, 
  Plus, 
  Trash2, 
  Users, 
  Briefcase, 
  Calendar,
  TrendingUp,
  MapPin,
  Building,
  Eye
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Project } from "@/lib/types"

// Mock projects data
const mockProjects: Project[] = [
  {
    id: "proj-001",
    title: "Senior Software Engineer",
    description: "We're looking for an experienced software engineer to join our backend team...",
    requirements: "5+ years experience, Node.js, Python, AWS",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    status: "Active",
    createdDate: "2024-01-10",
    applicantCount: 23,
    averageScore: 82.5,
    interviewsScheduled: 8,
    offersExtended: 2,
    hiredCount: 0
  },
  {
    id: "proj-002", 
    title: "Product Manager",
    description: "Seeking a strategic product manager to drive our mobile app development...",
    requirements: "3+ years PM experience, Agile, Data-driven decision making",
    company: "TechCorp Inc.",
    location: "Remote",
    status: "Active",
    createdDate: "2024-01-12",
    applicantCount: 15,
    averageScore: 78.2,
    interviewsScheduled: 5,
    offersExtended: 1,
    hiredCount: 0
  },
  {
    id: "proj-003",
    title: "UX Designer",
    description: "Creative UX designer needed for our design system and user experience...",
    requirements: "Portfolio required, Figma, User research experience",
    company: "TechCorp Inc.",
    location: "New York, NY",
    status: "Draft",
    createdDate: "2024-01-15",
    applicantCount: 0,
    averageScore: 0,
    interviewsScheduled: 0,
    offersExtended: 0,
    hiredCount: 0
  },
  {
    id: "proj-004",
    title: "Data Analyst",
    description: "Data analyst to help drive business insights and reporting...",
    requirements: "SQL, Python/R, Data visualization tools",
    company: "TechCorp Inc.",
    location: "Austin, TX",
    status: "Closed",
    createdDate: "2024-01-05",
    applicantCount: 31,
    averageScore: 75.8,
    interviewsScheduled: 12,
    offersExtended: 3,
    hiredCount: 1
  }
]

export default function ProjectsOverview() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      "Active": "bg-green-100 text-green-800",
      "Draft": "bg-gray-100 text-gray-800", 
      "Closed": "bg-red-100 text-red-800",
      "Paused": "bg-yellow-100 text-yellow-800"
    }
    return statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
  }

  const handleSelectProject = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProjects([...selectedProjects, projectId])
    } else {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(filteredProjects.map(p => p.id))
    } else {
      setSelectedProjects([])
    }
  }

  const handleDeleteProjects = () => {
    setProjects(projects.filter(p => !selectedProjects.includes(p.id)))
    setSelectedProjects([])
    setShowDeleteDialog(false)
  }

  const totalStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'Active').length,
    totalApplicants: projects.reduce((sum, p) => sum + p.applicantCount, 0),
    averageScore: projects.length > 0 ? projects.reduce((sum, p) => sum + p.averageScore, 0) / projects.length : 0
  }

  return (
    <SidebarInset>
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects Overview</h1>
            <p className="text-gray-600 mt-1">Manage all your hiring projects and job postings</p>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applicants</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.totalApplicants}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.averageScore.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          {/* Table Header Controls */}
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>All Projects</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Link href="/job_postings?create=true">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </Link>
                {selectedProjects.length > 0 && (
                  <Button 
                    variant="destructive" 
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedProjects.length})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applicants</TableHead>
                  <TableHead>Avg. Score</TableHead>
                  <TableHead>Interviews</TableHead>
                  <TableHead>Offers</TableHead>
                  <TableHead>Hired</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        checked={selectedProjects.includes(project.id)}
                        onChange={(e) => handleSelectProject(project.id, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <Link href={`/projects/${project.id}`} className="hover:underline">
                          <div className="font-medium text-blue-600 hover:text-blue-800">{project.title}</div>
                        </Link>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{project.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 text-gray-400" />
                        {project.company}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {project.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        {project.applicantCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{project.averageScore.toFixed(1)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        {project.interviewsScheduled}
                      </div>
                    </TableCell>
                    <TableCell>{project.offersExtended}</TableCell>
                    <TableCell>{project.hiredCount}</TableCell>
                    <TableCell>{project.createdDate}</TableCell>
                    <TableCell>
                      <Link href={`/projects/${project.id}`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Projects</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedProjects.length} project(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProjects} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  )
} 