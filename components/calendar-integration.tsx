"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Clock, Users, MapPin, Video, Plus } from "lucide-react"
import { format } from "date-fns"

interface Interview {
  id: string
  candidateName: string
  candidateEmail: string
  position: string
  date: Date
  time: string
  duration: number
  type: 'phone' | 'video' | 'onsite'
  location?: string
  interviewers: string[]
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

interface CalendarIntegrationProps {
  candidateId?: string
  candidateName?: string
  candidateEmail?: string
  position?: string
  onScheduled?: (interview: Interview) => void
}

const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.johnson@email.com',
    position: 'Senior Developer',
    date: new Date(2024, 0, 20, 10, 0),
    time: '10:00',
    duration: 60,
    type: 'video',
    interviewers: ['John Smith', 'Jane Doe'],
    status: 'scheduled'
  },
  {
    id: '2',
    candidateName: 'Michael Chen',
    candidateEmail: 'michael.chen@email.com',
    position: 'Product Manager',
    date: new Date(2024, 0, 22, 14, 0),
    time: '14:00',
    duration: 45,
    type: 'phone',
    interviewers: ['Alice Johnson'],
    status: 'scheduled'
  }
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

const interviewTypes = [
  { value: 'phone', label: 'Phone Interview', icon: '📞' },
  { value: 'video', label: 'Video Call', icon: '💻' },
  { value: 'onsite', label: 'On-site Interview', icon: '🏢' }
]

export default function CalendarIntegration({ 
  candidateId, 
  candidateName, 
  candidateEmail, 
  position,
  onScheduled 
}: CalendarIntegrationProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews)
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    candidateName: candidateName || '',
    candidateEmail: candidateEmail || '',
    position: position || '',
    time: '',
    duration: 60,
    type: 'video' as const,
    location: '',
    interviewers: '',
    notes: ''
  })

  const handleScheduleInterview = () => {
    if (!selectedDate || !scheduleForm.time) return

    const newInterview: Interview = {
      id: Math.random().toString(36).substr(2, 9),
      candidateName: scheduleForm.candidateName,
      candidateEmail: scheduleForm.candidateEmail,
      position: scheduleForm.position,
      date: selectedDate,
      time: scheduleForm.time,
      duration: scheduleForm.duration,
      type: scheduleForm.type,
      location: scheduleForm.location || undefined,
      interviewers: scheduleForm.interviewers.split(',').map(name => name.trim()),
      status: 'scheduled',
      notes: scheduleForm.notes || undefined
    }

    setInterviews([...interviews, newInterview])
    setIsScheduling(false)
    onScheduled?.(newInterview)
    
    // Reset form
    setScheduleForm({
      candidateName: '',
      candidateEmail: '',
      position: '',
      time: '',
      duration: 60,
      type: 'video',
      location: '',
      interviewers: '',
      notes: ''
    })
    setSelectedDate(undefined)
  }

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview => 
      interview.date.toDateString() === date.toDateString()
    )
  }

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: Interview['type']) => {
    switch (type) {
      case 'phone': return '📞'
      case 'video': return '💻'
      case 'onsite': return '🏢'
      default: return '📅'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Interview Calendar</h3>
          <p className="text-sm text-muted-foreground">Schedule and manage candidate interviews</p>
        </div>
        <Button onClick={() => setIsScheduling(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              modifiers={{
                hasInterview: (date) => getInterviewsForDate(date).length > 0
              }}
              modifiersStyles={{
                hasInterview: { 
                  backgroundColor: '#ddd6fe', 
                  color: '#5b21b6',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-4">
                {getInterviewsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium">Scheduled Interviews</h4>
                    {getInterviewsForDate(selectedDate).map((interview) => (
                      <div key={interview.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTypeIcon(interview.type)}</span>
                              <span className="font-medium">{interview.candidateName}</span>
                              <Badge className={getStatusColor(interview.status)}>
                                {interview.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{interview.position}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {interview.time} ({interview.duration}min)
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {interview.interviewers.join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No interviews scheduled for this date</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setIsScheduling(true)}
                    >
                      Schedule Interview
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Select a date to view or schedule interviews</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>Next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interviews
              .filter(interview => interview.date >= new Date() && interview.status === 'scheduled')
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{getTypeIcon(interview.type)}</div>
                    <div>
                      <h4 className="font-medium">{interview.candidateName}</h4>
                      <p className="text-sm text-muted-foreground">{interview.position}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {format(interview.date, 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {interview.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {interview.interviewers.length} interviewer(s)
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(interview.status)}>
                      {interview.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            {interviews.filter(i => i.date >= new Date() && i.status === 'scheduled').length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No upcoming interviews</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Interview Modal/Form */}
      {isScheduling && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-white shadow-2xl">
          <CardHeader>
            <CardTitle>Schedule New Interview</CardTitle>
            <CardDescription>Set up an interview with a candidate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="candidateName">Candidate Name</Label>
                <Input
                  id="candidateName"
                  value={scheduleForm.candidateName}
                  onChange={(e) => setScheduleForm({...scheduleForm, candidateName: e.target.value})}
                  placeholder="Enter candidate name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidateEmail">Candidate Email</Label>
                <Input
                  id="candidateEmail"
                  type="email"
                  value={scheduleForm.candidateEmail}
                  onChange={(e) => setScheduleForm({...scheduleForm, candidateEmail: e.target.value})}
                  placeholder="candidate@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={scheduleForm.position}
                  onChange={(e) => setScheduleForm({...scheduleForm, position: e.target.value})}
                  placeholder="Job position"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Interview Type</Label>
                <Select 
                  value={scheduleForm.type} 
                  onValueChange={(value: any) => setScheduleForm({...scheduleForm, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Select 
                  value={scheduleForm.time} 
                  onValueChange={(value) => setScheduleForm({...scheduleForm, time: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select 
                  value={scheduleForm.duration.toString()} 
                  onValueChange={(value) => setScheduleForm({...scheduleForm, duration: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interviewers">Interviewers</Label>
              <Input
                id="interviewers"
                value={scheduleForm.interviewers}
                onChange={(e) => setScheduleForm({...scheduleForm, interviewers: e.target.value})}
                placeholder="Enter names separated by commas"
              />
            </div>

            {scheduleForm.type === 'onsite' && (
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={scheduleForm.location}
                  onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})}
                  placeholder="Meeting room or address"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                placeholder="Additional notes or agenda"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsScheduling(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleInterview}
                disabled={!selectedDate || !scheduleForm.time || !scheduleForm.candidateName}
              >
                Schedule Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 