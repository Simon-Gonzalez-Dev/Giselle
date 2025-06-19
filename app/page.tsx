import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Briefcase, Clock, Calendar, Mail, FileText, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
  {
    title: "Total Candidates",
    value: "247",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Jobs",
    value: "8",
    change: "+2",
    icon: Briefcase,
    color: "text-green-600",
  },
  {
    title: "Interviews This Week",
    value: "15",
    change: "+5",
    icon: Calendar,
    color: "text-purple-600",
  },
  {
    title: "Avg. Score",
    value: "78.5",
    change: "+3.2",
    icon: Award,
    color: "text-orange-600",
  },
]

const recentCandidates = [
  {
    name: "Sarah Johnson",
    position: "Senior Developer",
    score: 92,
    status: "Interview Scheduled",
    date: "2024-01-15",
  },
  {
    name: "Michael Chen",
    position: "Product Manager",
    score: 88,
    status: "Phone Screen",
    date: "2024-01-14",
  },
  {
    name: "Emily Rodriguez",
    position: "UX Designer",
    score: 85,
    status: "Applied",
    date: "2024-01-13",
  },
  {
    name: "David Kim",
    position: "Data Analyst",
    score: 79,
    status: "Technical Review",
    date: "2024-01-12",
  },
]

const pipelineData = [
  { stage: "Applied", count: 45, color: "bg-gray-500" },
  { stage: "Screened", count: 28, color: "bg-blue-500" },
  { stage: "Interview", count: 15, color: "bg-yellow-500" },
  { stage: "Offered", count: 8, color: "bg-green-500" },
  { stage: "Hired", count: 5, color: "bg-purple-500" },
]

export default function Dashboard() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </header>

      <div className="flex-1 space-y-6 p-6 overflow-auto">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Candidates */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Candidates</CardTitle>
              <CardDescription>Latest candidate applications and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCandidates.map((candidate) => (
                  <div key={candidate.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">{candidate.score}/100</div>
                        <Progress value={candidate.score} className="w-16 h-2" />
                      </div>
                      <Badge
                        variant={
                          candidate.status === "Interview Scheduled"
                            ? "default"
                            : candidate.status === "Applied"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {candidate.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/candidates">View All Candidates</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Hiring Pipeline</CardTitle>
              <CardDescription>Candidates by stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineData.map((stage) => (
                  <div key={stage.stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <span className="text-sm">{stage.stage}</span>
                    </div>
                    <span className="font-medium">{stage.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button asChild className="h-20 flex-col gap-2">
                <Link href="/upload">
                  <FileText className="h-6 w-6" />
                  Upload CV
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link href="/jobs">
                  <Briefcase className="h-6 w-6" />
                  Create Job
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link href="/communications">
                  <Mail className="h-6 w-6" />
                  Send Email
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link href="/candidates">
                  <Clock className="h-6 w-6" />
                  Schedule Interview
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
