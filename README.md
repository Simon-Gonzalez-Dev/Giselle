# HR CRM - Hiring Management System

A modern, comprehensive HR CRM web application designed to streamline the hiring process for small-to-medium HR teams. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🌟 Features

### Core Functionality

#### 1. CV Analysis & Upload
- **Drag-and-drop CV upload** supporting PDF, DOC, and DOCX files
- **Intelligent CV parsing** that extracts candidate information automatically
- **Advanced 7-metric scoring system** evaluating candidates across:
  - Interpersonal Skills (communication, leadership, collaboration)
  - Cognitive Abilities (analytical thinking, creativity, learning)
  - Emotional Intelligence (self-awareness, social awareness, regulation)
  - Professional Qualities (work ethic, adaptability, entrepreneurship)
  - Cultural Fit for Startups (collaboration, innovation, autonomy, growth)
  - Technical Aptitude (problem-solving, tech learning, innovation)
  - Life Experience (personal growth, diversity, development)
- **Job-specific scoring** with customizable weights per role
- **Real-time processing feedback** with step-by-step progress indicators

#### 2. Interactive Candidate Dashboard
- **Spreadsheet-style data grid** with sortable columns
- **Advanced filtering and search** by name, position, score, status, date ranges
- **Bulk actions** for email communication and pipeline management
- **Export/import capabilities** for data management
- **Column customization** and view preferences
- **Responsive design** that adapts to mobile and tablet screens

#### 3. Job Posting & Requirements Management
- **Comprehensive job creation** with detailed descriptions and requirements
- **Custom scoring criteria configuration** with sliders for each metric weight
- **Job templates** for common positions (Engineer, PM, Sales, etc.)
- **Skills matching** between job requirements and candidate CVs
- **Job posting analytics** and applicant tracking

#### 4. Candidate Profile & Pipeline Tracking
- **Detailed candidate profiles** with parsed resume data
- **Visual pipeline tracker** showing progress through hiring stages
- **Score breakdown visualization** across all seven metrics
- **Interview scheduling integration** with calendar components
- **Notes and feedback system** with timestamped entries
- **Document attachments** for additional candidate materials
- **Action history timeline** tracking all interactions

#### 5. Email Communication Tools
- **Template management** for common communications (invites, rejections, offers)
- **Bulk email capabilities** with candidate filtering
- **Email tracking** with delivery and open receipts
- **Calendar invite integration** for interview scheduling
- **Personalization tokens** for dynamic content insertion
- **Communication history** with full audit trail

#### 6. Analytics & Reporting
- **Pipeline analytics** with conversion rates and bottleneck identification
- **Hiring metrics** including time-to-hire and success rates
- **Score distribution analysis** across candidates and positions
- **Trend tracking** for hiring quality and efficiency
- **Department breakdown** and skill analysis
- **KPI dashboards** with real-time updates

## 🏗️ Technical Architecture

### Frontend Stack
- **Next.js 15** with App Router for modern React development
- **TypeScript** for type safety and better developer experience
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for consistent, accessible component library
- **Lucide React** for comprehensive icon set
- **React Hook Form** with Zod validation for form handling
- **date-fns** for date manipulation and formatting

### Key Components

#### Scoring Engine (`lib/scoring-engine.ts`)
- Sophisticated CV analysis using keyword matching and semantic analysis
- Configurable scoring weights per job position
- Evidence-based scoring across seven key metrics
- Job-specific criteria matching and highlighting

#### Type Definitions (`lib/types.ts`)
- Comprehensive TypeScript interfaces for all data models
- Type safety for candidate, job, email, and analytics data
- Strongly typed API contracts and component props

#### Analytics Dashboard (`components/analytics-dashboard.tsx`)
- Interactive charts and KPI visualizations
- Pipeline funnel analysis with conversion tracking
- Skill distribution and trend analysis
- Customizable time ranges and metric selection

#### Calendar Integration (`components/calendar-integration.tsx`)
- Full interview scheduling workflow
- Calendar visualization with interview highlighting
- Multiple interview types (phone, video, on-site)
- Automated email notifications and calendar invites

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Modern web browser with JavaScript enabled

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd hr-crm-app
pnpm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Configure your environment variables
```

3. **Run the development server:**
```bash
pnpm dev
```

4. **Open your browser:**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
hr-crm-app/
├── app/                          # Next.js App Router pages
│   ├── candidates/               # Candidate management
│   │   ├── [id]/page.tsx        # Individual candidate profile
│   │   └── page.tsx             # Candidate dashboard
│   ├── communications/page.tsx   # Email management
│   ├── jobs/page.tsx            # Job posting management
│   ├── settings/page.tsx        # Application settings
│   ├── upload/page.tsx          # CV upload and analysis
│   ├── layout.tsx               # Root layout with sidebar
│   └── page.tsx                 # Main dashboard
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── analytics-dashboard.tsx  # Analytics and reporting
│   ├── app-sidebar.tsx          # Navigation sidebar
│   ├── calendar-integration.tsx # Interview scheduling
│   └── theme-provider.tsx       # Theme management
├── lib/                         # Utility libraries
│   ├── scoring-engine.ts        # CV analysis and scoring
│   ├── types.ts                 # TypeScript definitions
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## 🔧 Configuration

### Scoring System Customization

The CV scoring engine can be customized by modifying the keyword sets and scoring weights in `lib/scoring-engine.ts`:

```typescript
// Add custom keywords for specific metrics
const customKeywords = {
  interpersonalSkills: {
    communication: ['your', 'custom', 'keywords'],
    // ...
  }
}

// Adjust scoring weights per job type
const jobSpecificWeights = {
  'Software Engineer': {
    technicalAptitude: 90,
    interpersonalSkills: 70,
    // ...
  }
}
```

### Email Templates

Create custom email templates in the communications section:

```typescript
const customTemplate = {
  name: "Follow-up Interview",
  subject: "Next Steps - {Position} Role",
  content: "Dear {Name},\n\nThank you for your time...",
  category: "Follow-up"
}
```

## 🔌 Integrations

### Planned Integrations
- **Email Services**: AWS SES, SendGrid, or SMTP
- **Calendar**: Google Calendar, Outlook Calendar
- **Job Boards**: LinkedIn, Indeed, Stack Overflow Jobs
- **Video Conferencing**: Zoom, Google Meet, Microsoft Teams
- **ATS Systems**: Greenhouse, Lever, BambooHR

### API Endpoints (Future Implementation)
```
POST /api/candidates          # Create candidate
GET  /api/candidates          # List candidates with filtering
GET  /api/candidates/:id      # Get candidate details
PUT  /api/candidates/:id      # Update candidate
POST /api/cv/parse           # Parse uploaded CV
POST /api/interviews         # Schedule interview
GET  /api/analytics          # Get hiring analytics
POST /api/emails             # Send email
```

## 🎯 User Workflow

### Typical Hiring Process

1. **Job Creation**: Define role requirements and scoring criteria
2. **CV Upload**: Candidates apply and CVs are automatically processed
3. **Candidate Review**: Use dashboard to filter and review top candidates
4. **Interview Scheduling**: Schedule interviews through calendar integration
5. **Pipeline Management**: Move candidates through hiring stages
6. **Communication**: Send updates, invites, and decisions via email
7. **Analytics Review**: Track hiring metrics and optimize process

### Key User Actions

- **Upload and analyze CV** with automatic scoring
- **Filter candidates** by score, skills, experience
- **Schedule interviews** with calendar integration
- **Send bulk emails** to candidate groups
- **Track pipeline progress** with visual indicators
- **Generate reports** on hiring performance

## 📊 Analytics & Metrics

### Key Performance Indicators
- **Conversion Rate**: Applied → Hired percentage
- **Time to Hire**: Average days from application to offer
- **Quality Score**: Average candidate scoring
- **Interview Success**: Interview → Offer ratio
- **Offer Acceptance**: Offer → Hired ratio

### Pipeline Analytics
- Candidate distribution across stages
- Bottleneck identification
- Drop-off rate analysis
- Stage duration tracking

### Scoring Analytics
- Score distribution by position
- Metric performance trends
- Skill gap analysis
- Benchmarking against industry standards

## 🔒 Security & Privacy

### Data Protection
- Candidate PII encryption
- Secure file storage (AWS S3 recommended)
- Access logging and audit trails
- GDPR compliance features

### Authentication
- Single-user authentication
- JWT token management
- Session security
- Password policies

## 🚀 Deployment

### Recommended Infrastructure
- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Backend**: AWS Lambda, Vercel Functions, or dedicated server
- **Database**: PostgreSQL on AWS RDS or Supabase
- **File Storage**: AWS S3 or Cloudinary
- **Email**: AWS SES or SendGrid

### Environment Variables
```env
DATABASE_URL=postgresql://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
EMAIL_SERVICE_API_KEY=...
CALENDAR_API_CREDENTIALS=...
```

## 🛠️ Development Roadmap

### Phase 1: Core Features ✅
- [x] Basic CV upload and parsing
- [x] Candidate dashboard with filtering
- [x] Job posting management
- [x] Email template system
- [x] Basic analytics

### Phase 2: Advanced Features 🚧
- [ ] Real CV parsing (OCR/NLP integration)
- [ ] Advanced analytics with charts
- [ ] Calendar integration
- [ ] Email tracking and automation
- [ ] Mobile responsiveness

### Phase 3: Integrations 🔮
- [ ] External job board posting
- [ ] Video conferencing integration
- [ ] Advanced ATS features
- [ ] Machine learning scoring
- [ ] API development

### Phase 4: Enterprise Features 🔮
- [ ] Multi-user support
- [ ] Role-based permissions
- [ ] Advanced reporting
- [ ] Compliance features
- [ ] White-label options

## 🤝 Contributing

This is a comprehensive HR CRM solution designed for immediate use and easy customization. The codebase follows modern React/Next.js patterns and is fully typed with TypeScript.

### Key Implementation Notes

1. **Mock Data**: Currently uses mock data for demonstration. Replace with real API calls for production use.

2. **CV Parsing**: Implement actual CV parsing using services like:
   - Google Cloud Document AI
   - AWS Textract
   - Microsoft Form Recognizer
   - Open-source solutions like Apache Tika

3. **Email Integration**: Connect to email services for actual sending:
   - AWS SES for reliable delivery
   - SendGrid for advanced features
   - SMTP for simple setups

4. **Database**: Implement persistent storage:
   - PostgreSQL for structured data
   - Redis for caching
   - S3 for file storage

5. **Authentication**: Add proper user management:
   - Auth0, Clerk, or Supabase Auth
   - JWT token handling
   - Password reset functionality

This HR CRM application provides a solid foundation for managing the complete hiring process with professional-grade features and modern technology stack.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 