/// <reference types="node" />

import { Mistral } from '@mistralai/mistralai';
import { NextRequest } from 'next/server'

// CV Analysis API using Mistral AI
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

// Initialize Mistral client
let mistralClient: Mistral | null = null;

function getMistralClient(): Mistral {
  if (!mistralClient) {
    const apiKey = process.env.MISTRAL_API_KEY || process.env.MISTRAL_KEY;
    if (!apiKey) {
      throw new Error('Mistral API key not configured. Please set MISTRAL_API_KEY in your .env.local file');
    }
    console.log('🔑 Initializing Mistral client with API key:', apiKey.substring(0, 10) + '...');
    mistralClient = new Mistral({ apiKey });
  }
  return mistralClient;
}

async function callMistralAPI(prompt: string, retries: number = 3): Promise<string> {
  const client = getMistralClient();
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
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

      const content = chatResponse.choices[0].message.content;
      if (!content) {
        return '';
      }
      return typeof content === 'string' ? content : content[0]?.type === 'text' ? content[0].text : '';
    } catch (error: any) {
      console.error(`Mistral API attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        throw error;
      }
      
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited, waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else if (error.message?.includes('401')) {
        throw error;
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  throw new Error('All retry attempts failed');
}

async function extractCandidateInfo(fileContent: string) {
  // Clean and stringify the CV content
  const cleanContent = typeof fileContent === 'string' 
    ? fileContent.trim().replace(/\s+/g, ' ')
    : JSON.stringify(fileContent).trim();

  const prompt = `Extract the following information from this CV/resume and return ONLY a valid JSON object:

{
  "name": "Full name of the candidate",
  "experience": "Most recent job title and company",
  "education": "Highest degree and field of study",
  "skills": "Key technical and professional skills (comma-separated)",
  "activities": ["List of volunteer work, community involvement, or extracurricular activities"],
  "yearsExperience": "Total years of professional experience (number)"
}

CV Content:
${cleanContent}

IMPORTANT: Return ONLY the JSON object, no additional text, explanations, or formatting.`

  const response = await callMistralAPI(prompt);
  
  try {
    const parsed = JSON.parse(response);
    return {
      name: parsed.name || "Unknown Candidate",
      experience: parsed.experience || "No experience listed",
      education: parsed.education || "No education listed",
      skills: parsed.skills || "No skills listed",
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
      yearsExperience: parseInt(parsed.yearsExperience) || 0
    }
  } catch (error: any) {
    throw new Error(`Failed to parse AI response for candidate info: ${error.message}`);
  }
}

async function analyzeMetric(metric: string, fileContent: string, candidateInfo: any): Promise<number> {
  const rubric = SCORING_RUBRICS[metric as keyof typeof SCORING_RUBRICS]
  
  // Clean and stringify the CV content
  const cleanContent = typeof fileContent === 'string' 
    ? fileContent.trim().replace(/\s+/g, ' ')
    : JSON.stringify(fileContent).trim();
  
  const prompt = `Analyze this candidate's ${metric} based on their CV and provide a score from 0-100.

Assessment Criteria for ${metric}:
${rubric.criteria.map(c => `- ${c}`).join('\n')}

Relevant Keywords: ${rubric.keywords.join(', ')}

CV Content:
${cleanContent}

Candidate Background:
- Experience: ${candidateInfo.experience}
- Education: ${candidateInfo.education}
- Skills: ${candidateInfo.skills}
- Activities: ${candidateInfo.activities.join(', ')}

IMPORTANT: You must provide your response in exactly this format:
Analysis: [Your detailed analysis of the candidate's ${metric}]
Score: [A number between 0-100]

The Score line must contain only a number between 0 and 100.`

  const response = await callMistralAPI(prompt);
  
  // Extract score from response
  const scoreMatch = response.match(/Score:\s*(\d+)/i)
  if (scoreMatch) {
    return Math.max(0, Math.min(100, parseInt(scoreMatch[1])))
  }
  
  // If no score found, throw an error
  throw new Error(`Mistral AI did not provide a score for ${metric}. Response: ${response}`)
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

Use formal HR language and maintain a professional tone throughout. Provide a comprehensive analysis that would be suitable for HR documentation.`

  return await callMistralAPI(prompt);
}

async function analyzeCV(fileName: string, fileContent: string) {
  try {
    // Validate and clean file content
    if (!fileContent || typeof fileContent !== 'string') {
      throw new Error('Invalid file content provided');
    }
    
    // Clean the content by removing excessive whitespace and normalizing
    const cleanContent = fileContent
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .substring(0, 10000); // Limit content length to avoid API limits
    
    if (cleanContent.length < 10) {
      throw new Error('File content is too short to analyze');
    }
    
    console.log(`Analyzing CV: ${fileName} (${cleanContent.length} characters)`);
    
    const candidateInfo = await extractCandidateInfo(cleanContent)
    
    const scores = await Promise.all(
      Object.keys(SCORING_RUBRICS).map(async (metric) => ({
        metric,
        score: await analyzeMetric(metric, cleanContent, candidateInfo)
      }))
    )

    const averageScore = Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
    
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, fileContent } = body;

    // Validate required fields
    if (!fileName || !fileContent) {
      return new Response(
        JSON.stringify({ 
          error: 'File name and content are required',
          received: { 
            hasFileName: !!fileName, 
            hasFileContent: !!fileContent,
            fileContentType: typeof fileContent 
          }
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Ensure fileContent is a string
    if (typeof fileContent !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: 'File content must be a string',
          receivedType: typeof fileContent
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Processing CV analysis for: ${fileName}`);
    const analysis = await analyzeCV(fileName, fileContent);

    return new Response(
      JSON.stringify(analysis),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error: any) {
    console.error('CV Analysis API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze CV. Please try again.',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 