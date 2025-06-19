"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Filter, Mail, Calendar, MoreHorizontal, Eye, Download, UserPlus, Plus } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// Global candidates from all projects
const allCandidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Developer",
    project: "Senior Software Engineer",
    projectId: "proj-001",
    averageScore: 92,
    status: "Interview Scheduled",
    location: "San Francisco, CA",
    experience: "5 years",
    education: "BS Computer Science",
    interviewDate: "2024-01-20",
    appliedDate: "2024-01-10",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    position: "Product Manager",
    project: "Product Manager",
    projectId: "proj-002",
    averageScore: 88,
    status: "Phone Screen",
    location: "New York, NY",
    experience: "7 years",
    education: "MBA, BS Engineering",
    interviewDate: null,
    appliedDate: "2024-01-12",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    position: "UX Designer",
    project: "UX Designer",
    projectId: "proj-003",
    averageScore: 85,
    status: "Applied",
    location: "Austin, TX",
    experience: "4 years",
    education: "BFA Design",
    interviewDate: null,
    appliedDate: "2024-01-13",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 456-7890",
    position: "Data Analyst",
    project: "Data Analyst",
    projectId: "proj-004",
    averageScore: 79,
    status: "Technical Review",
    location: "Seattle, WA",
    experience: "3 years",
    education: "MS Statistics",
    interviewDate: "2024-01-18",
    appliedDate: "2024-01-11",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    phone: "+1 (555) 567-8901",
    position: "Marketing Manager",
    project: "Marketing Manager",
    projectId: "proj-005",
    averageScore: 91,
    status: "Offered",
    location: "Los Angeles, CA",
    experience: "6 years",
    education: "MBA Marketing",
    interviewDate: "2024-01-15",
    appliedDate: "2024-01-08",
  },
]

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(allCandidates)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false)
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    project: "",
    location: "",
    experience: "",
    education: ""
  })

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    const matchesProject = projectFilter === "all" || candidate.project === projectFilter
    return matchesSearch && matchesStatus && matchesProject
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "secondary"
      case "Phone Screen":
        return "outline"
      case "Interview Scheduled":
        return "default"
      case "Technical Review":
        return "outline"
      case "Offered":
        return "default"
      case "Hired":
        return "default"
      case "Rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleAddCandidate = () => {
    const candidate = {
      id: Date.now(),
      ...newCandidate,
      projectId: `proj-${Math.floor(Math.random() * 1000)}`,
      averageScore: Math.floor(Math.random() * 40) + 60,
      status: "Applied",
      interviewDate: null,
      appliedDate: new Date().toISOString().split('T')[0],
    }
    setCandidates([...candidates, candidate])
    setNewCandidate({
      name: "",
      email: "",
      phone: "",
      position: "",
      project: "",
      location: "",
      experience: "",
      education: ""
    })
    setIsAddCandidateOpen(false)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(filteredCandidates.map(c => c.id))
    } else {
      setSelectedCandidates([])
    }
  }

  const uniqueProjects = [...new Set(candidates.map(c => c.project))]
  const totalStats = {
    totalCandidates: candidates.length,
    averageScore: candidates.length > 0 ? candidates.reduce((sum, c) => sum + c.averageScore, 0) / candidates.length : 0,
    interviewsScheduled: candidates.filter(c => c.status === "Interview Scheduled").length,
    offersExtended: candidates.filter(c => c.status === "Offered").length
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">All Candidates</h1>
      </header>

      <div className="flex-1 space-y-6 p-6 overflow-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.totalCandidates}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.averageScore.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.interviewsScheduled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Offers Extended</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalStats.offersExtended}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Candidate Management</CardTitle>
              <Dialog open={isAddCandidateOpen} onOpenChange={setIsAddCandidateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Candidate
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Candidate</DialogTitle>
                    <DialogDescription>
                      Manually add a candidate to the system
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newCandidate.name}
                          onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCandidate.email}
                          onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newCandidate.phone}
                          onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position Applied For</Label>
                        <Input
                          id="position"
                          value={newCandidate.position}
                          onChange={(e) => setNewCandidate({...newCandidate, position: e.target.value})}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project">Project/Job Posting</Label>
                        <Input
                          id="project"
                          value={newCandidate.project}
                          onChange={(e) => setNewCandidate({...newCandidate, project: e.target.value})}
                          placeholder="Senior Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={newCandidate.location}
                          onChange={(e) => setNewCandidate({...newCandidate, location: e.target.value})}
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          id="experience"
                          value={newCandidate.experience}
                          onChange={(e) => setNewCandidate({...newCandidate, experience: e.target.value})}
                          placeholder="5 years"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="education">Education</Label>
                        <Input
                          id="education"
                          value={newCandidate.education}
                          onChange={(e) => setNewCandidate({...newCandidate, education: e.target.value})}
                          placeholder="BS Computer Science"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddCandidateOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCandidate}>
                        Add Candidate
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {uniqueProjects.map((project) => (
                    <SelectItem key={project} value={project}>{project}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                  <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="Technical Review">Technical Review</SelectItem>
                  <SelectItem value="Offered">Offered</SelectItem>
                  <SelectItem value="Hired">Hired</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {selectedCandidates.length > 0 && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">{selectedCandidates.length} candidate(s) selected</span>
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Interview Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-muted/50">
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCandidates([...selectedCandidates, candidate.id])
                          } else {
                            setSelectedCandidates(selectedCandidates.filter((id) => id !== candidate.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate.education}</div>
                      </div>
                    </TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.phone}</TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>
                      <Link href={`/projects/${candidate.projectId}`} className="text-blue-600 hover:underline">
                        {candidate.project}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{candidate.averageScore}</span>
                        <Progress value={candidate.averageScore} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                    </TableCell>
                    <TableCell>{candidate.location}</TableCell>
                    <TableCell>{candidate.experience}</TableCell>
                    <TableCell>
                      {candidate.interviewDate ? (
                        <span className="text-sm">{candidate.interviewDate}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Not scheduled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/candidates/${candidate.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Resume
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
      </div>
    </SidebarInset>
  )
}
