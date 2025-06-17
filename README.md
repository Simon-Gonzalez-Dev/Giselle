# GISELLE - AI-Powered HR CV Evaluator

A comprehensive, professional CV evaluation system built with Next.js 15, TypeScript, and AI-powered analysis using Mistral AI.

## 🚀 Features

### Core Functionality
- **AI-Powered CV Analysis**: Advanced analysis using Mistral AI's `magistral-small-2506` model
- **Multi-Format Support**: Upload PDF, DOC, and DOCX files
- **Comprehensive Scoring**: 7 professional metrics evaluation
- **Fallback System**: Robust keyword-based analysis when AI is unavailable

### Assessment Metrics
1. **Interpersonal Skills** - Communication, Leadership, Collaboration
2. **Cognitive Abilities** - Analytical thinking, Creativity, Learning ability
3. **Emotional Intelligence** - Self-awareness, Social awareness, Emotional regulation
4. **Professional Qualities** - Work ethic, Adaptability, Entrepreneurial spirit
5. **Cultural Fit** - Team culture, Organizational values, Work style
6. **Technical Aptitude** - Problem-solving, Learning capacity, Innovation
7. **Life Experience** - Personal growth, Diversity exposure, Personal development

### Advanced Features
- **Visual Analytics**: Radar charts and bar charts for score visualization
- **Multi-CV Comparison**: Compare multiple candidates with leaderboard
- **HR-Style Reports**: Professional analysis suitable for HR documentation
- **Real-time Processing**: Fast analysis with retry logic and error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **AI Integration**: Mistral AI API with official SDK
- **Package Manager**: pnpm

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/GISELLE.git
   cd GISELLE
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   MISTRAL_API_KEY=mist-your_actual_api_key_here
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Mistral AI Setup
1. Get your API key from [Mistral AI Console](https://console.mistral.ai/)
2. Add it to `.env.local` as `MISTRAL_API_KEY`
3. The app will automatically use the `magistral-small-2506` model

### Environment Variables
- `MISTRAL_API_KEY`: Your Mistral AI API key (required for AI analysis)
- `MISTRAL_KEY`: Alternative environment variable name (fallback)

## 📊 API Endpoints

### POST `/api/analyze-cv`
Analyzes a CV and returns comprehensive evaluation results.

**Request Body**:
```json
{
  "fileName": "candidate-cv.pdf",
  "fileContent": "CV text content..."
}
```

**Response**:
```json
{
  "id": 1234567890,
  "fileName": "candidate-cv",
  "candidateName": "John Doe",
  "uploadDate": "2025-06-17T23:26:43.400Z",
  "scores": [
    {
      "metric": "Interpersonal Skills",
      "score": 75
    }
    // ... all 7 metrics
  ],
  "averageScore": 72,
  "analysis": "Professional HR-style analysis...",
  "profile": {
    "name": "John Doe",
    "experience": "Software Engineer at Tech Corp",
    "education": "Bachelor of Science in Computer Science",
    "skills": "JavaScript, Python, React",
    "activities": ["Volunteer work", "Community organizer"],
    "yearsExperience": 3
  }
}
```

## 🎯 Usage

1. **Upload CV**: Drag and drop or select a CV file (PDF/DOC/DOCX)
2. **AI Analysis**: The system automatically analyzes the CV using AI
3. **View Results**: See scores, charts, and professional analysis
4. **Compare Candidates**: Upload multiple CVs for comparison
5. **Export Reports**: Use the analysis for HR documentation

## 🔄 Fallback System

When AI analysis is unavailable (no API key, rate limits, etc.), the system automatically falls back to keyword-based scoring, ensuring the application always works.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- AI analysis by [Mistral AI](https://mistral.ai/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**GISELLE** - Empowering HR professionals with AI-driven candidate evaluation. 
