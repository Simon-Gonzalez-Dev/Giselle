import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Bell, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">Settings</h1>
      </header>

      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg">HM</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline">Change Photo</Button>
                    <p className="text-sm text-muted-foreground mt-1">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="HR" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="hr@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue="TechCorp Inc." />
                  </div>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">New Applications</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new candidates apply</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Interview Reminders</Label>
                      <p className="text-sm text-muted-foreground">Reminders for upcoming interviews</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Email Responses</Label>
                      <p className="text-sm text-muted-foreground">When candidates reply to your emails</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Weekly hiring pipeline summary</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Scoring Configuration
                </CardTitle>
                <CardDescription>Configure default scoring weights and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Minimum Score Threshold</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Candidates below this score will be flagged for review
                    </p>
                    <Input type="number" defaultValue="60" min="0" max="100" />
                  </div>

                  <div>
                    <Label className="text-base">Auto-Reject Threshold</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Automatically reject candidates below this score
                    </p>
                    <Input type="number" defaultValue="30" min="0" max="100" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Enable Auto-Scoring</Label>
                      <p className="text-sm text-muted-foreground">Automatically score new CV uploads</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button>Save Scoring Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Integrations
                </CardTitle>
                <CardDescription>Connect with external services and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Email Service</h4>
                        <p className="text-sm text-muted-foreground">AWS SES</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-purple-100 rounded flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-sm">G</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Google Calendar</h4>
                        <p className="text-sm text-muted-foreground">Interview scheduling</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">L</span>
                      </div>
                      <div>
                        <h4 className="font-medium">LinkedIn</h4>
                        <p className="text-sm text-muted-foreground">Job posting integration</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}
