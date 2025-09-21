# Giselle - AI-Powered Bias-Free CV Evaluation Platform

## Overview

Giselle is an advanced AI-powered CV evaluation platform designed to reduce bias in the hiring process by providing objective, comprehensive candidate assessments. The application analyzes CVs using sophisticated AI models and presents results through an intuitive dashboard with detailed analytics and comparison tools.

## Core Mission

**Reducing Hiring Bias Through AI-Driven Assessment**

Giselle addresses the critical need for fair, objective candidate evaluation by:
- Eliminating unconscious bias through standardized AI assessment
- Providing consistent evaluation criteria across all candidates
- Offering transparent scoring based on professional competencies
- Enabling data-driven hiring decisions

## Technology Stack

### Frontend Architecture
- **Framework**: Next.js 15.2.4 with App Router
  - Server-side rendering (SSR) and static site generation (SSG)
  - Built-in API routes for backend functionality
  - Automatic code splitting and optimization
  - Image optimization and performance monitoring
- **React**: Version 19 with latest concurrent features
  - Server Components for improved performance
  - Client Components for interactive functionality
  - React hooks for state management
- **Language**: TypeScript 5 with strict type checking
  - Full type safety across the application
  - Interface definitions for API responses
  - Compile-time error detection

### UI/UX Technology
- **Styling**: Tailwind CSS 3.4.17
  - Utility-first CSS framework
  - Custom design system with CSS variables
  - Responsive design with mobile-first approach
  - Dark mode support with theme switching
- **Component Library**: Radix UI + shadcn/ui
  - Accessible, unstyled UI primitives
  - Pre-built components with consistent design
  - Keyboard navigation and screen reader support
  - Customizable theming system
- **Data Visualization**: Recharts
  - React-based charting library
  - Responsive charts with smooth animations
  - Custom tooltips and interactive elements
  - Radar charts and bar charts for analytics
- **Icons**: Lucide React
  - Consistent icon system
  - Tree-shakable icon imports
  - Customizable size and styling

### Backend & AI Integration
- **Runtime Environment**: Node.js with Next.js API Routes
  - Serverless function architecture
  - Automatic scaling and deployment
  - Built-in middleware support
  - Request/response handling
- **AI Model**: Mistral AI (open-mistral-7b)
  - Advanced language model for CV analysis
  - Structured JSON response generation
  - Temperature control (0.3) for consistent results
  - Token limit management (2000 max tokens)
  - Retry logic with exponential backoff
- **Document Processing Pipeline**:
  - **PDF Processing**: `pdf-parse` library
    - Text extraction from PDF documents
    - Support for various PDF formats
    - Error handling for corrupted files
  - **DOCX Processing**: `mammoth` library
    - Microsoft Word document parsing
    - Raw text extraction with formatting preservation
    - Support for complex document structures
  - **OCR Capabilities**: `tesseract.js`
    - Optical character recognition for image-based PDFs
    - Multi-language text recognition
    - WebAssembly-based processing
  - **PDF Manipulation**: `pdf-lib`
    - PDF document creation and modification
    - Form handling and metadata extraction
    - Cross-platform compatibility

### Data Management & Storage
- **Client-side Storage**: localStorage API
  - Persistent data storage across sessions
  - CV analysis history management
  - Candidate comparison data
  - No external database dependencies
- **State Management**: React hooks
  - `useState` for component state
  - `useEffect` for side effects
  - Custom hooks for reusable logic
  - Context API for global state (if needed)

### Development & Build Tools
- **Package Manager**: pnpm
  - Fast, disk space efficient package management
  - Strict dependency resolution
  - Workspace support for monorepos
  - Lock file for reproducible builds
- **Build System**: Next.js built-in bundler
  - Webpack-based bundling with optimizations
  - Automatic code splitting
  - Tree shaking for smaller bundles
  - Hot module replacement for development
- **Code Quality**: 
  - **ESLint**: Code linting with Next.js configuration
  - **TypeScript**: Static type checking
  - **Prettier**: Code formatting (if configured)
- **Development Features**:
  - Hot reloading for instant feedback
  - Source maps for debugging
  - Environment variable management
  - Development/production mode switching

### Performance Optimizations
- **Next.js Optimizations**:
  - Automatic image optimization
  - Font optimization with Google Fonts
  - Bundle analysis and optimization
  - Static generation where possible
- **React Optimizations**:
  - Server Components for reduced client bundle
  - Lazy loading for non-critical components
  - Memoization for expensive calculations
  - Efficient re-rendering strategies
- **Network Optimizations**:
  - API response caching
  - Request deduplication
  - Error boundary implementation
  - Loading state management

### Security & Privacy
- **API Security**:
  - Environment variable protection
  - Input validation and sanitization
  - File type and size restrictions
  - Error handling without data exposure
- **Client Security**:
  - XSS protection with React
  - CSRF protection with Next.js
  - Secure file upload handling
  - No sensitive data in client-side code

### Key Dependencies & Libraries

#### Core Framework Dependencies
- **@hookform/resolvers**: Form validation with React Hook Form
- **@mistralai/mistralai**: Official Mistral AI SDK for TypeScript/JavaScript
- **next**: Next.js framework with App Router
- **react**: React library for UI components
- **react-dom**: React DOM rendering

#### UI & Styling Dependencies
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
  - Accordion, Alert Dialog, Avatar, Button, Card, Dialog, Dropdown Menu
  - Form controls, Navigation, Popover, Progress, Select, Tabs, Toast
  - Tooltip, Toggle, Switch, Slider, and many more
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx**: Utility for constructing className strings conditionally
- **tailwind-merge**: Utility to merge Tailwind CSS classes without conflicts
- **tailwindcss-animate**: Animation utilities for Tailwind CSS
- **lucide-react**: Beautiful & consistent icon toolkit
- **next-themes**: Theme switching for Next.js applications

#### Data Visualization & Charts
- **recharts**: Composable charting library built on React and D3
- **@radix-ui/react-chart**: Chart components for data visualization

#### Document Processing & File Handling
- **mammoth**: Convert Microsoft Word documents to HTML
- **pdf-lib**: Create and modify PDF documents
- **pdf-parse**: PDF text extraction library
- **tesseract.js**: Pure JavaScript OCR for 100+ languages
- **reactjs-pdf-reader**: React component for PDF viewing

#### Form Handling & Validation
- **react-hook-form**: Performant, flexible forms with easy validation
- **zod**: TypeScript-first schema validation
- **input-otp**: One-time password input component

#### Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **cmdk**: Fast, unstyled command menu component
- **sonner**: Toast notifications for React
- **vaul**: Drawer component for mobile
- **embla-carousel-react**: Carousel library for React
- **react-resizable-panels**: Resizable panel layouts
- **supports-color**: Detect whether a terminal supports color

#### Development Dependencies
- **@types/node**: TypeScript definitions for Node.js
- **@types/react**: TypeScript definitions for React
- **@types/react-dom**: TypeScript definitions for React DOM
- **@types/pdf-parse**: TypeScript definitions for pdf-parse
- **typescript**: TypeScript compiler
- **postcss**: CSS post-processor
- **tailwindcss**: Utility-first CSS framework

### Architecture Patterns & Design Decisions

#### Application Architecture
- **Full-Stack Next.js Application**: Single codebase with frontend and backend
- **API-First Design**: RESTful API endpoints for all backend functionality
- **Component-Based Architecture**: Reusable React components with clear separation of concerns
- **Type-Safe Development**: End-to-end TypeScript for better developer experience

#### State Management Strategy
- **Local Component State**: React hooks for component-specific state
- **Persistent Storage**: localStorage for user data and analysis history
- **No Global State Management**: Avoided Redux/Zustand for simplicity
- **Server State**: Direct API calls with error handling and loading states

#### File Processing Architecture
- **Multi-Format Support**: Unified interface for PDF and DOCX processing
- **Base64 Encoding**: Secure file transmission between client and server
- **Streaming Processing**: Efficient handling of large documents
- **Error Recovery**: Graceful fallbacks for corrupted or unsupported files

#### AI Integration Patterns
- **Structured Prompts**: Consistent JSON response format from AI
- **Retry Logic**: Exponential backoff for API failures
- **Token Management**: Content truncation to stay within limits
- **Response Validation**: JSON parsing with error recovery

#### Performance Considerations
- **Code Splitting**: Automatic route-based splitting with Next.js
- **Image Optimization**: Next.js built-in image optimization
- **Bundle Analysis**: Webpack bundle analyzer for size optimization
- **Caching Strategy**: Browser caching for static assets

#### Security Architecture
- **Environment Variables**: Secure API key management
- **Input Validation**: Client and server-side validation
- **File Type Restrictions**: Whitelist approach for uploads
- **Error Sanitization**: No sensitive data in error messages

## AI Integration & Backend Architecture

### Mistral AI Integration

The application leverages Mistral AI's `open-mistral-7b` model for comprehensive CV analysis:

```typescript
// Core AI Configuration
const mistralClient = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const chatResponse = await client.chat.complete({
  model: 'open-mistral-7b',
  messages: [
    {
      role: 'system',
      content: 'You are an expert HR professional and CV evaluator. Provide accurate, professional assessments based on the given criteria.'
    },
    {
      role: 'user',
      content: prompt
    }
  ],
  temperature: 0.3,
  maxTokens: 2000
});
```

### API Architecture

**Primary Endpoint**: `/api/analyze-cv`

The API follows a robust architecture with:
- **Input Validation**: Comprehensive file type and size validation
- **Document Processing**: Multi-format support (PDF, DOCX)
- **Error Handling**: Retry logic with exponential backoff
- **Response Formatting**: Structured JSON output

### Document Processing Pipeline

1. **File Upload**: Base64 encoding for secure transmission
2. **Format Detection**: Automatic file type identification
3. **Text Extraction**: 
   - PDF: `pdf-parse` library
   - DOCX: `mammoth` library
4. **Content Validation**: Text quality and length verification
5. **AI Analysis**: Mistral AI processing with structured prompts

## Assessment Framework

### Seven Core Competency Metrics

The platform evaluates candidates across seven standardized dimensions:

1. **Interpersonal Skills** (Communication, Leadership, Collaboration)
2. **Cognitive Abilities** (Analytical thinking, Creativity, Learning ability)
3. **Emotional Intelligence** (Self-awareness, Social awareness, Emotional regulation)
4. **Professional Qualities** (Work ethic, Adaptability, Entrepreneurial spirit)
5. **Cultural Fit** (Team culture, Organizational values, Work style)
6. **Technical Aptitude** (Problem-solving, Learning capacity, Innovation)
7. **Life Experience** (Personal growth, Diversity exposure, Personal development)

### Scoring System

- **Scale**: 0-100 points per metric
- **Weighting**: Equal weight across all metrics
- **Performance Levels**:
  - 85-100: Exceptional
  - 75-84: Strong
  - 65-74: Satisfactory
  - 0-64: Developing

## Key Features

### CV Analysis
- **Multi-format Support**: PDF and DOCX file processing
- **Real-time Processing**: Instant analysis with progress indicators
- **Comprehensive Reports**: Detailed candidate profiles and assessments
- **Visual Analytics**: Radar charts and bar charts for score visualization

### Comparison Dashboard
- **Candidate Ranking**: Automated leaderboard based on overall scores
- **Metric Champions**: Top performers in each competency area
- **Historical Tracking**: Persistent storage of all evaluations
- **Export Capabilities**: Report generation and sharing features

### Bias Reduction Features
- **Standardized Criteria**: Consistent evaluation rubrics across all candidates
- **Keyword-based Analysis**: Objective skill and experience detection
- **Blind Assessment**: Focus on competencies rather than demographic factors
- **Transparent Scoring**: Clear methodology and reasoning for all scores

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Mistral AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Giselle
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create `.env.local` file:
   ```env
   MISTRAL_API_KEY=your_mistral_api_key_here
   ```

4. **Development Server**
   ```bash
   pnpm dev
   ```

5. **Production Build**
   ```bash
   pnpm build
   pnpm start
   ```

## Project Structure

```
Giselle/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── analyze-cv/    # CV analysis endpoint
│   ├── analysis/          # Analysis results page
│   ├── comparison/        # Comparison dashboard
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── bar-chart.tsx     # Data visualization
│   └── radar-chart.tsx   # Competency radar chart
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Security & Privacy

- **API Key Management**: Secure environment variable handling
- **File Processing**: Client-side file validation and size limits
- **Data Storage**: Local storage only (no external database)
- **Error Handling**: Comprehensive error logging without data exposure

## UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode Support**: Built-in theme switching capability
- **Accessibility**: WCAG compliant with Radix UI primitives
- **Loading States**: Smooth user experience with progress indicators
- **Error Boundaries**: Graceful error handling and user feedback

## Performance Optimizations

- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js built-in image optimization
- **Bundle Analysis**: Optimized dependency management
- **Caching**: Efficient API response caching
- **Lazy Loading**: Component-level lazy loading

## Future Enhancements

- **Video Analysis**: Integration of candidate video interview analysis
- **Multi-language Support**: Internationalization capabilities
- **Advanced Analytics**: Machine learning insights and trends
- **Team Collaboration**: Multi-user evaluation workflows
- **Integration APIs**: HRIS and ATS system integrations

## Contributing

We welcome contributions to improve Giselle's bias reduction capabilities and user experience. Please follow our coding standards and submit pull requests for review.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Mistral AI for providing the core AI analysis capabilities
- The Next.js and React communities for excellent tooling
- shadcn/ui for the beautiful component library
- All contributors who help make hiring more fair and objective

---

**Giselle** - Making hiring decisions more objective, fair, and data-driven through the power of AI.
