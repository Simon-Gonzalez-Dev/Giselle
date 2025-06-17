// CV Analysis API using Deepseek R1 0528 Qwen3 8B
export interface CVAnalysis {
  id: number
  fileName: string
  candidateName: string
  uploadDate: string
  scores: Array<{ metric: string; score: number }>
  averageScore: number
  analysis: string
  profile: {
    experience: string
    education: string
    skills: string
    activities: string[]
    yearsExperience: number
  }
}

export interface AnalysisRequest {
  fileName: string
  fileContent: string
}

const SCORING_RUBRICS = {
  "Interpersonal Skills": {
    criteria: ["Communication", "Leadership", "Collaboration"],
    keywords: ["team", "lead", "manage", "communicate", "present", "speak", "write", "collaborate", "coordinate", "mentor", "train", "facilitate"],
    weight: 1
  },
  "Cognitive Abilities": {
    criteria: ["Analytical thinking", "Creativity", "Learning ability"],
    keywords: ["analyze", "research", "solve", "create", "innovate", "learn", "study", "problem", "strategy", "optimize", "design", "develop"],
    weight: 1
  },
  "Emotional Intelligence": {
    criteria: ["Self-awareness", "Social awareness", "Emotional regulation"],
    keywords: ["empathy", "emotional", "awareness", "self", "social", "relationship", "understanding", "compassion", "support", "counsel", "mediate"],
    weight: 1
  },
  "Professional Qualities": {
    criteria: ["Work ethic", "Adaptability", "Entrepreneurial spirit"],
    keywords: ["dedicated", "hardworking", "adapt", "flexible", "entrepreneur", "initiative", "drive", "motivated", "reliable", "punctual", "organized"],
    weight: 1
  },
  "Cultural Fit": {
    criteria: ["Team culture", "Organizational values", "Work style"],
    keywords: ["startup", "fast-paced", "growth", "culture", "values", "team", "collaborative", "flexible", "innovative", "agile", "dynamic"],
    weight: 1
  },
  "Technical Aptitude": {
    criteria: ["Problem-solving", "Learning capacity", "Innovation"],
    keywords: ["technical", "programming", "software", "technology", "code", "develop", "build", "create", "innovate", "debug", "implement"],
    weight: 1
  },
  "Life Experience": {
    criteria: ["Personal growth", "Diversity exposure", "Personal development"],
    keywords: ["volunteer", "travel", "diverse", "culture", "experience", "growth", "development", "international", "community", "service"],
    weight: 1
  }
}

export async function analyzeCV(fileName: string, fileContent: string): Promise<CVAnalysis> {
  try {
    // Extract candidate information using AI
    const candidateInfo = await extractCandidateInfo(fileContent)
    
    // Analyze each metric using AI
    const scores = await Promise.all(
      Object.keys(SCORING_RUBRICS).map(async (metric) => ({
        metric,
        score: await analyzeMetric(metric, fileContent, candidateInfo)
      }))
    )

    const averageScore = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
    
    // Generate comprehensive HR-style analysis
    const analysis = await generateHRStyleAnalysis(scores, averageScore, candidateInfo)

    return {
      id: Date.now(),
      fileName: fileName.replace(/\.[^/.]+$/, ""),
      candidateName: candidateInfo.name,
      uploadDate: new Date().toISOString(),
      scores,
      averageScore,
      analysis,
      profile: candidateInfo
    }
  } catch (error) {
    console.error('CV Analysis failed:', error)
    throw new Error('Failed to analyze CV. Please try again.')
  }
}

async function extractCandidateInfo(fileContent: string) {
  const prompt = `Extract the following information from this CV/resume in JSON format:
{
  "name": "Full name of the candidate",
  "experience": "Most recent job title and company",
  "education": "Highest degree and field of study",
  "skills": "Key technical and professional skills (comma-separated)",
  "activities": ["List of volunteer work, community involvement, or extracurricular activities"],
  "yearsExperience": "Total years of professional experience (number)"
}

CV Content:
${fileContent}

Return only the JSON object, no additional text.`

  const response = await callDeepseekAPI(prompt)
  
  try {
    const parsed = JSON.parse(response)
    return {
      name: parsed.name || "Unknown Candidate",
      experience: parsed.experience || "No experience listed",
      education: parsed.education || "No education listed",
      skills: parsed.skills || "No skills listed",
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
      yearsExperience: parseInt(parsed.yearsExperience) || 0
    }
  } catch (error) {
    // Fallback to basic extraction
    return {
      name: extractName(fileContent),
      experience: extractExperience(fileContent),
      education: extractEducation(fileContent),
      skills: extractSkills(fileContent),
      activities: extractActivities(fileContent),
      yearsExperience: extractYearsExperience(fileContent)
    }
  }
}

async function analyzeMetric(metric: string, fileContent: string, candidateInfo: any): Promise<number> {
  const rubric = SCORING_RUBRICS[metric as keyof typeof SCORING_RUBRICS]
  
  const prompt = `Analyze this candidate's ${metric} based on their CV and provide a score from 0-100.

Assessment Criteria for ${metric}:
${rubric.criteria.map(c => `- ${c}`).join('\n')}

Relevant Keywords: ${rubric.keywords.join(', ')}

CV Content:
${fileContent}

Candidate Background:
- Experience: ${candidateInfo.experience}
- Education: ${candidateInfo.education}
- Skills: ${candidateInfo.skills}
- Activities: ${candidateInfo.activities.join(', ')}

Provide a detailed analysis and then give a score from 0-100. Format your response as:
Analysis: [Your detailed analysis]
Score: [Number between 0-100]`

  const response = await callDeepseekAPI(prompt)
  
  // Extract score from response
  const scoreMatch = response.match(/Score:\s*(\d+)/i)
  if (scoreMatch) {
    return Math.max(0, Math.min(100, parseInt(scoreMatch[1])))
  }
  
  // Fallback to keyword-based scoring
  return calculateKeywordScore(metric, fileContent, candidateInfo)
}

async function generateHRStyleAnalysis(scores: Array<{ metric: string; score: number }>, averageScore: number, candidateInfo: any): Promise<string> {
  const topMetric = scores.reduce((max, current) => (current.score > max.score ? current : max))
  const bottomMetric = scores.reduce((min, current) => (current.score < min.score ? current : min))
  
  const prompt = `Write a professional HR-style analysis of this candidate based on their CV assessment.

Candidate Profile:
- Name: ${candidateInfo.name}
- Experience: ${candidateInfo.experience}
- Education: ${candidateInfo.education}
- Skills: ${candidateInfo.skills}
- Activities: ${candidateInfo.activities.join(', ')}

Assessment Results:
- Overall Average Score: ${averageScore}/100
- Top Strength: ${topMetric.metric} (${topMetric.score}/100)
- Development Area: ${bottomMetric.metric} (${bottomMetric.score}/100)

Individual Scores:
${scores.map(s => `- ${s.metric}: ${s.score}/100`).join('\n')}

Write a formal, professional analysis suitable for HR documentation. Include:
1. Overall performance assessment
2. Key strengths and their business value
3. Areas for development
4. Cultural fit considerations
5. Final recommendation

Use formal HR language and maintain a professional tone throughout.`

  return await callDeepseekAPI(prompt)
}

async function callDeepseekAPI(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_KEY
  
  if (!apiKey) {
    throw new Error('Deepseek API key not configured')
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-r1-0528-qwen3-8b',
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
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Deepseek API error:', error)
    throw new Error('Failed to connect to analysis service')
  }
}

// Fallback extraction functions
function extractName(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    if (line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/)) {
      return line.trim()
    }
  }
  return "Unknown Candidate"
}

function extractExperience(content: string): string {
  const experiencePatterns = [
    /(?:experience|work|employment).*?([A-Z][a-z]+ (?:at|with|for) [A-Z][a-zA-Z\s]+)/i,
    /([A-Z][a-z]+ (?:Engineer|Manager|Analyst|Developer|Designer|Coordinator|Specialist|Consultant|Director|Lead|Senior|Junior|Associate)).*?(?:at|with|for) ([A-Z][a-zA-Z\s]+)/i
  ]
  
  for (const pattern of experiencePatterns) {
    const match = content.match(pattern)
    if (match) {
      return match[1] || match[0]
    }
  }
  return "No experience listed"
}

function extractEducation(content: string): string {
  const educationPatterns = [
    /(?:Bachelor|Master|PhD|MBA|BSc|MSc|BA|MA).*?(?:in|of) ([A-Z][a-zA-Z\s]+)/i,
    /([A-Z][a-z]+ (?:University|College|Institute|School))/i
  ]
  
  for (const pattern of educationPatterns) {
    const match = content.match(pattern)
    if (match) {
      return match[0]
    }
  }
  return "No education listed"
}

function extractSkills(content: string): string {
  const skillPatterns = [
    /(?:skills|technologies|tools|languages|frameworks).*?([A-Z][a-zA-Z\s,]+)/i,
    /(JavaScript|Python|Java|React|Node|SQL|AWS|Docker|Git|Agile|Scrum|Marketing|Sales|Design|Analysis)/gi
  ]
  
  for (const pattern of skillPatterns) {
    const match = content.match(pattern)
    if (match) {
      return match[0]
    }
  }
  return "No skills listed"
}

function extractActivities(content: string): string[] {
  const activityPatterns = [
    /(?:volunteer|mentor|organizer|member|board|committee|community|service)/gi,
    /(?:volunteered|mentored|organized|led|founded|co-founded|participated)/gi
  ]
  
  const activities: string[] = []
  for (const pattern of activityPatterns) {
    const matches = content.match(pattern)
    if (matches) {
      activities.push(...matches)
    }
  }
  
  return activities.length > 0 ? activities.slice(0, 3) : ["No activities listed"]
}

function extractYearsExperience(content: string): number {
  const yearPatterns = [
    /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i,
    /experience.*?(\d+)\s*(?:years?|yrs?)/i
  ]
  
  for (const pattern of yearPatterns) {
    const match = content.match(pattern)
    if (match) {
      return parseInt(match[1])
    }
  }
  return 0
}

function calculateKeywordScore(metric: string, content: string, candidateInfo: any): number {
  const rubric = SCORING_RUBRICS[metric as keyof typeof SCORING_RUBRICS]
  const keywords = rubric.keywords
  const profileText = `${content} ${candidateInfo.experience} ${candidateInfo.education} ${candidateInfo.skills} ${candidateInfo.activities.join(' ')}`.toLowerCase()
  
  const keywordMatches = keywords.filter(keyword => 
    profileText.includes(keyword.toLowerCase())
  ).length
  
  let baseScore = Math.min(80, keywordMatches * 8 + 40)
  const experienceBonus = candidateInfo.yearsExperience * 2
  const activityBonus = candidateInfo.activities.length * 3
  
  let finalScore = Math.min(100, baseScore + experienceBonus + activityBonus)
  finalScore += (Math.random() - 0.5) * 10
  finalScore = Math.max(30, Math.min(100, Math.round(finalScore)))
  
  return finalScore
} 