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
import { Search, Filter, Mail, Calendar, MoreHorizontal, Eye, Download } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const candidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    position: "Senior Developer",
    score: 92,
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
    position: "Product Manager",
    score: 88,
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
    position: "UX Designer",
    score: 85,
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
    position: "Data Analyst",
    score: 79,
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
    position: "Marketing Manager",
    score: 91,
    status: "Offered",
    location: "Los Angeles, CA",
    experience: "6 years",
    education: "MBA Marketing",
    interviewDate: "2024-01-15",
    appliedDate: "2024-01-08",
  },
]

export default function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
    return matchesSearch && matchesStatus
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

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Candidates</h1>
      </header>

      <div className="flex-1 space-y-6 p-6 overflow-auto">
        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Management</CardTitle>
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
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
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
                        <div className="text-sm text-muted-foreground">{candidate.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{candidate.score}</span>
                        <Progress value={candidate.score} className="w-16 h-2" />
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
