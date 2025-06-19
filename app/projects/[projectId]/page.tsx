"use client"

import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Search, TrendingUp, Users, Briefcase, Calendar, Mail, Eye, UserPlus, Building, MapPin } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const mockProject = {
  id: "proj-001",
  title: "Senior Software Engineer",
  description: "We're looking for an experienced software engineer to join our backend team.",
  company: "TechCorp Inc.",
  location: "San Francisco, CA",
  status: "Active",
  createdDate: "2024-01-10"
}

const mockCandidates = [
  {
    id: 1,
    name: "Alex Mitchell",
    email: "alex.mitchell@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    averageScore: 92,
    status: "Interview Scheduled",
    experience: "5 years",
    appliedDate: "2024-01-11"
  },
  {
    id: 2,
    name: "Sarah Chen",
    email: "sarah.chen@email.com", 
    phone: "+1 (555) 234-5678",
    location: "Seattle, WA",
    averageScore: 87,
    status: "Screening",
    experience: "7 years",
    appliedDate: "2024-01-12"
  }
]

export default function ProjectDashboard({ params }: { params: { projectId: string } }) {
  const [candidates, setCandidates] = useState(mockCandidates)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false)
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: ""
  })

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      "Interview Scheduled": "bg-blue-100 text-blue-800",
      "Screening": "bg-yellow-100 text-yellow-800",
      "Offer Extended": "bg-green-100 text-green-800",
      "Applied": "bg-gray-100 text-gray-800",
      "Rejected": "bg-red-100 text-red-800"
    }
    return statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
  }

  const handleAddCandidate = () => {
    const candidate = {
      id: Date.now(),
      ...newCandidate,
      averageScore: Math.floor(Math.random() * 40) + 60,
      status: "Applied",
      appliedDate: new Date().toISOString().split('T')[0]
    }
    setCandidates([...candidates, candidate])
    setNewCandidate({ name: "", email: "", phone: "", location: "", experience: "" })
    setIsAddCandidateOpen(false)
  }

  const projectStats = {
    totalCandidates: candidates.length,
    averageScore: candidates.length > 0 ? candidates.reduce((sum, c) => sum + c.averageScore, 0) / candidates.length : 0,
    interviewsScheduled: candidates.filter(c => c.status === "Interview Scheduled").length,
    offersExtended: candidates.filter(c => c.status === "Offer Extended").length
  }

  return (
    <SidebarInset>
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Projects</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{mockProject.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{mockProject.title}</h1>
                <Badge className={getStatusBadge(mockProject.status)}>
                  {mockProject.status}
                </Badge>
              </div>
              <p className="text-gray-600 max-w-2xl">{mockProject.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {mockProject.company}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {mockProject.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {mockProject.createdDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{projectStats.totalCandidates}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{projectStats.averageScore.toFixed(1)}</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{projectStats.interviewsScheduled}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Offers Extended</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{projectStats.offersExtended}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Project Candidates</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search candidates..."
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
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Screening">Screening</SelectItem>
                    <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isAddCandidateOpen} onOpenChange={setIsAddCandidateOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Candidate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Candidate</DialogTitle>
                      <DialogDescription>
                        Manually add a candidate to this project
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
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newCandidate.location}
                            onChange={(e) => setNewCandidate({...newCandidate, location: e.target.value})}
                            placeholder="San Francisco, CA"
                          />
                        </div>
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
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Avg. Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCandidates([...selectedCandidates, candidate.id])
                          } else {
                            setSelectedCandidates(selectedCandidates.filter(id => id !== candidate.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{candidate.name}</div>
                    </TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.phone}</TableCell>
                    <TableCell>{candidate.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{candidate.averageScore}</span>
                        <Progress value={candidate.averageScore} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(candidate.status)}>
                        {candidate.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{candidate.experience}</TableCell>
                    <TableCell>{candidate.appliedDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
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