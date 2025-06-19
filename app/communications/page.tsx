"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Send, Users, Eye, Edit, Plus, Clock } from "lucide-react"
import { useState } from "react"

const emailTemplates = [
  {
    id: 1,
    name: "Interview Invitation",
    subject: "Interview Invitation - {Position} Role",
    content:
      "Dear {Name},\n\nThank you for your interest in the {Position} role at our company. We were impressed with your application and would like to invite you for an interview.\n\nPlease let us know your availability for the following dates:\n- {Date1}\n- {Date2}\n- {Date3}\n\nBest regards,\nHR Team",
    category: "Interview",
  },
  {
    id: 2,
    name: "Application Received",
    subject: "Application Received - {Position}",
    content:
      "Dear {Name},\n\nThank you for applying for the {Position} role. We have received your application and will review it carefully.\n\nWe will contact you within 5-7 business days regarding the next steps.\n\nBest regards,\nHR Team",
    category: "Acknowledgment",
  },
  {
    id: 3,
    name: "Rejection - After Interview",
    subject: "Update on Your Application - {Position}",
    content:
      "Dear {Name},\n\nThank you for taking the time to interview for the {Position} role. After careful consideration, we have decided to move forward with another candidate.\n\nWe were impressed with your qualifications and encourage you to apply for future opportunities.\n\nBest regards,\nHR Team",
    category: "Rejection",
  },
]

const emailHistory = [
  {
    id: 1,
    recipient: "sarah.johnson@email.com",
    subject: "Interview Invitation - Senior Developer Role",
    template: "Interview Invitation",
    status: "Sent",
    sentDate: "2024-01-15 10:30",
    opened: true,
  },
  {
    id: 2,
    recipient: "michael.chen@email.com",
    subject: "Application Received - Product Manager",
    template: "Application Received",
    status: "Sent",
    sentDate: "2024-01-14 14:20",
    opened: false,
  },
  {
    id: 3,
    recipient: "emily.rodriguez@email.com",
    subject: "Interview Invitation - UX Designer Role",
    template: "Interview Invitation",
    status: "Draft",
    sentDate: null,
    opened: false,
  },
]

export default function CommunicationsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    content: "",
  })
  const [isComposeOpen, setIsComposeOpen] = useState(false)

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id.toString() === templateId)
    if (template) {
      setEmailData({
        to: emailData.to,
        subject: template.subject,
        content: template.content,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "default"
      case "Draft":
        return "secondary"
      case "Failed":
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
        <h1 className="text-xl font-semibold">Communications</h1>
      </header>

      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Email Communications</h2>
            <p className="text-muted-foreground">Manage email templates and candidate communications</p>
          </div>
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Compose Email
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Compose Email</DialogTitle>
                <DialogDescription>Send an email to candidates using templates or custom content</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient</Label>
                    <Input
                      id="recipient"
                      value={emailData.to}
                      onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                      placeholder="candidate@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template">Use Template</Label>
                    <Select
                      value={selectedTemplate}
                      onValueChange={(value) => {
                        setSelectedTemplate(value)
                        handleTemplateSelect(value)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    placeholder="Email subject"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    value={emailData.content}
                    onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                    placeholder="Email content..."
                    rows={8}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline">Save Draft</Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Email History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Communications</CardTitle>
                <CardDescription>Track sent emails and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Opened</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailHistory.map((email) => (
                      <TableRow key={email.id}>
                        <TableCell>{email.recipient}</TableCell>
                        <TableCell className="max-w-xs truncate">{email.subject}</TableCell>
                        <TableCell>{email.template}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(email.status)}>{email.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {email.sentDate ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {email.sentDate}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {email.opened ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Email Templates</h3>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {emailTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription>{template.subject}</CardDescription>
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{template.content}</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Email Actions</CardTitle>
                <CardDescription>Send emails to multiple candidates at once</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Filter Candidates</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select candidate group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-applied">All Applied Candidates</SelectItem>
                        <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
                        <SelectItem value="phone-screen">Phone Screen Stage</SelectItem>
                        <SelectItem value="high-scores">High Score Candidates (80+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {emailTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id.toString()}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Selected Candidates: 12</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Preview the candidates who will receive this email before sending.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">Preview Recipients</Button>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send Bulk Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
