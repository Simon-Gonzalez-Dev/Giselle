export interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  position: string
  overallScore: number
  status: CandidateStatus
  appliedDate: string
  interviewDate?: string
  resumeUrl?: string
  scores: ScoreBreakdown
  experience: Experience[]
  education: Education[]
  skills: string[]
  notes: Note[]
  jobId: string
  extractedData?: ExtractedCVData
}

export interface ScoreBreakdown {
  interpersonalSkills: number
  cognitiveAbilities: number
  emotionalIntelligence: number
  professionalQualities: number
  culturalFit: number
  technicalAptitude: number
  lifeExperience: number
}

export interface Experience {
  title: string
  company: string
  duration: string
  description: string
  current?: boolean
}

export interface Education {
  degree: string
  school: string
  year: string
  gpa?: string
  field?: string
}

export interface Note {
  id: string
  date: string
  author: string
  content: string
  type?: 'general' | 'interview' | 'phone_screen' | 'reference'
}

export interface Job {
  id: string
  title: string
  department: string
  location: string
  status: JobStatus
  description: string
  requirements: string
  applicants: number
  posted: string
  weights: ScoreBreakdown
  skills: string[]
  salaryRange?: {
    min: number
    max: number
  }
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  category: EmailCategory
  variables: string[]
}

export interface EmailHistory {
  id: string
  recipient: string
  candidateId?: string
  subject: string
  template?: string
  status: EmailStatus
  sentDate?: string
  opened: boolean
  replied: boolean
  content: string
}

export interface ExtractedCVData {
  name?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  certifications?: string[]
  languages?: string[]
}

export type CandidateStatus = 
  | 'Applied' 
  | 'Phone Screen' 
  | 'Interview Scheduled' 
  | 'Technical Review' 
  | 'Final Interview'
  | 'Offered' 
  | 'Hired' 
  | 'Rejected'

export type JobStatus = 'Active' | 'Draft' | 'Closed' | 'Paused'

export type EmailCategory = 'Interview' | 'Acknowledgment' | 'Rejection' | 'Offer' | 'Follow-up'

export type EmailStatus = 'Draft' | 'Sent' | 'Failed' | 'Delivered'

export interface PipelineStage {
  name: string
  completed: boolean
  current?: boolean
  date?: string
}

export interface DashboardStats {
  totalCandidates: number
  activeJobs: number
  interviewsThisWeek: number
  averageScore: number
  pipelineData: { stage: string; count: number; color: string }[]
}

export interface FilterOptions {
  searchTerm: string
  statusFilter: CandidateStatus | 'all'
  scoreRange: [number, number]
  dateRange: [Date?, Date?]
  jobFilter: string | 'all'
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface ScoringWeights extends ScoreBreakdown {
  enabled: boolean
  minimumThreshold: number
  autoRejectThreshold: number
}

export interface UserSettings {
  profile: {
    firstName: string
    lastName: string
    email: string
    company: string
    avatar?: string
  }
  notifications: {
    newApplications: boolean
    interviewReminders: boolean
    emailResponses: boolean
    weeklyReports: boolean
  }
  scoring: ScoringWeights
  integrations: {
    emailService: boolean
    calendar: boolean
    linkedin: boolean
  }
} 