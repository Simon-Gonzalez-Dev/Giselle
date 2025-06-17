# HR CV Evaluator

A professional AI-powered CV evaluation tool that provides comprehensive candidate assessment across seven key professional metrics using the Deepseek R1 0528 Qwen3 8B model.

## Features

### 🎯 **Comprehensive Assessment**
- **7 Professional Metrics**: Interpersonal Skills, Cognitive Abilities, Emotional Intelligence, Professional Qualities, Cultural Fit, Technical Aptitude, and Life Experience
- **AI-Powered Analysis**: Uses Deepseek R1 0528 Qwen3 8B for intelligent CV evaluation
- **Professional HR Style**: Formal, HR-like analysis suitable for professional documentation

### 📊 **Visual Analytics**
- **Radar Charts**: Visual representation of competency across all metrics
- **Bar Charts**: Detailed score breakdown for individual metrics
- **Performance Indicators**: Color-coded scoring system (Exceptional, Strong, Satisfactory, Developing)

### 🔄 **Multi-CV Comparison**
- **Leaderboard**: Rank candidates by overall performance
- **Metric Champions**: Identify top performers in each category
- **Comparison Matrix**: Detailed side-by-side analysis
- **Historical Tracking**: Store and compare multiple CV analyses

### 📁 **File Support**
- **PDF Documents**: Full PDF parsing and analysis
- **Word Documents**: Support for .doc and .docx files
- **Text Extraction**: Intelligent content extraction for analysis

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Deepseek API key

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd hr-cv-evaluator

# Install dependencies
pnpm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```bash
DEEPSEEK_KEY=your_deepseek_api_key_here
```

Get your Deepseek API key from: https://platform.deepseek.com/

### 4. Run the Application
```bash
# Development mode
pnpm dev

# Build for production
pnpm build
pnpm start
```

The application will be available at `http://localhost:3000`

## Usage

### 1. Upload CV
- Navigate to the home page
- Click "Upload CV for Analysis"
- Select a PDF or Word document (.pdf, .doc, .docx)
- Click "Begin Professional Assessment"

### 2. View Analysis Results
- **Candidate Profile**: Basic information extracted from CV
- **Overall Performance**: Average score across all metrics
- **Top Strength**: Highest scoring competency area
- **Professional Background**: Experience, education, and skills
- **Skills & Activities**: Technical skills and community involvement
- **Visual Charts**: Radar and bar charts for metric comparison
- **Detailed Analysis**: Professional HR-style assessment

### 3. Compare Multiple CVs
- Upload additional CVs to build a comparison database
- Navigate to "CV Comparison Dashboard"
- View leaderboard rankings
- Identify metric champions
- Export comparison reports

## Assessment Metrics

### 1. **Interpersonal Skills** (Communication, Leadership, Collaboration)
- Evaluates team dynamics, communication abilities, and leadership potential
- Keywords: team, lead, manage, communicate, present, speak, write, collaborate

### 2. **Cognitive Abilities** (Analytical thinking, Creativity, Learning ability)
- Assesses problem-solving skills, innovation, and learning capacity
- Keywords: analyze, research, solve, create, innovate, learn, study, problem

### 3. **Emotional Intelligence** (Self-awareness, Social awareness, Emotional regulation)
- Measures emotional maturity and social skills
- Keywords: empathy, emotional, awareness, self, social, relationship, understanding

### 4. **Professional Qualities** (Work ethic, Adaptability, Entrepreneurial spirit)
- Evaluates professional behavior and adaptability
- Keywords: dedicated, hardworking, adapt, flexible, entrepreneur, initiative, drive

### 5. **Cultural Fit** (Team culture, Organizational values, Work style)
- Assesses alignment with startup/company culture
- Keywords: startup, fast-paced, growth, culture, values, team, collaborative

### 6. **Technical Aptitude** (Problem-solving, Learning capacity, Innovation)
- Evaluates technical skills and innovation potential
- Keywords: technical, programming, software, technology, code, develop, build

### 7. **Life Experience** (Personal growth, Diversity exposure, Personal development)
- Measures personal development and diverse experiences
- Keywords: volunteer, travel, diverse, culture, experience, growth, development

## Technical Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **Recharts**: Data visualization

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Deepseek API**: AI-powered CV analysis
- **Local Storage**: Client-side data persistence

### AI Integration
- **Model**: Deepseek R1 0528 Qwen3 8B
- **Analysis**: Multi-step AI evaluation process
- **Fallback**: Keyword-based scoring for reliability

## API Endpoints

### POST `/api/analyze-cv`
Analyzes a CV using AI and returns comprehensive evaluation results.

**Request Body:**
```json
{
  "fileName": "string",
  "fileContent": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "fileName": "string",
  "candidateName": "string",
  "uploadDate": "string",
  "scores": [
    {
      "metric": "string",
      "score": "number"
    }
  ],
  "averageScore": "number",
  "analysis": "string",
  "profile": {
    "experience": "string",
    "education": "string",
    "skills": "string",
    "activities": ["string"],
    "yearsExperience": "number"
  }
}
```

## Development

### Project Structure
```
hr-cv-evaluator/
├── app/
│   ├── api/analyze-cv/     # CV analysis API
│   ├── analysis/           # Analysis results page
│   ├── comparison/         # CV comparison page
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── radar-chart.tsx    # Radar chart component
│   └── bar-chart.tsx      # Bar chart component
├── lib/
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

### Key Components
- **HomePage**: File upload and analysis initiation
- **AnalysisPage**: Detailed results display
- **ComparisonPage**: Multi-CV comparison dashboard
- **RadarChart**: Visual metric representation
- **BarChart**: Score breakdown visualization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Note**: This application requires a valid Deepseek API key to function. The AI analysis provides professional HR-style evaluations suitable for candidate assessment and hiring decisions. 