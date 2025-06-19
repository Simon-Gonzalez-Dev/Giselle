import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Calendar, Phone, MapPin, GraduationCap, Briefcase, Star, Clock, Edit, Download } from "lucide-react"

// Mock data - in real app this would come from API
const candidate = {
  id: 1,
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  position: "Senior Developer",
  overallScore: 92,
  status: "Interview Scheduled",
  appliedDate: "2024-01-10",
  interviewDate: "2024-01-20",
  scores: {
    interpersonalSkills: 88,
    cognitiveAbilities: 95,
    emotionalIntelligence: 82,
    professionalQualities: 90,
    culturalFit: 94,
    technicalAptitude: 98,
    lifeExperience: 85,
  },
  experience: [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      duration: "2021 - Present",
      description:
        "Led development of microservices architecture, mentored junior developers, implemented CI/CD pipelines.",
    },
    {
      title: "Software Engineer",
      company: "StartupXYZ",
      duration: "2019 - 2021",
      description: "Full-stack development using React and Node.js, database optimization, API design.",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "Stanford University",
      year: "2019",
      gpa: "3.8/4.0",
    },
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes"],
  notes: [
    {
      date: "2024-01-15",
      author: "HR Manager",
      content: "Strong technical background, excellent communication skills during phone screen.",
    },
  ],
}

const pipelineStages = [
  { name: "Applied", completed: true },
  { name: "Phone Screen", completed: true },
  { name: "Technical Interview", completed: false, current: true },
  { name: "Final Interview", completed: false },
  { name: "Offer", completed: false },
  { name: "Hired", completed: false },
]

export default function CandidateProfile({ params }: { params: { id: string } }) {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Candidate Profile</h1>
      </header>

      <div className="flex-1 space-y-6 p-6 overflow-auto">
        {/* Header Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-lg">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{candidate.name}</h2>
                  <p className="text-lg text-muted-foreground">{candidate.position}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {candidate.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {candidate.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:ml-auto">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{candidate.overallScore}</span>
                  <div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                    <Progress value={candidate.overallScore} className="w-24" />
                  </div>
                </div>
                <Badge variant="default" className="w-fit">
                  {candidate.status}
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pipeline Status */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Pipeline Status</CardTitle>
              <CardDescription>Current progress through hiring stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {pipelineStages.map((stage, index) => (
                  <div key={stage.name} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        stage.completed
                          ? "bg-green-500 text-white"
                          : stage.current
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs mt-2 text-center">{stage.name}</span>
                    {index < pipelineStages.length - 1 && (
                      <div className={`w-full h-0.5 mt-4 ${stage.completed ? "bg-green-500" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>Performance across seven key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(candidate.scores).map(([metric, score]) => (
                  <div key={metric} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{metric.replace(/([A-Z])/g, " $1").trim()}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={score} className="w-24" />
                      <span className="text-sm font-medium w-8">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Applied</div>
                  <div className="text-sm text-muted-foreground">{candidate.appliedDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Interview</div>
                  <div className="text-sm text-muted-foreground">{candidate.interviewDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Rating</div>
                  <div className="text-sm text-muted-foreground">Excellent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4">
                    <h4 className="font-medium">{exp.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {exp.company} • {exp.duration}
                    </p>
                    <p className="text-sm mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.education.map((edu, index) => (
                  <div key={index}>
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">
                      {edu.school} • {edu.year}
                    </p>
                    <p className="text-sm">GPA: {edu.gpa}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Notes
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.notes.map((note, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">{note.author}</span>
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
                <Textarea placeholder="Add a note about this candidate..." />
                <Button size="sm">Save Note</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
