/// <reference types="node" />

import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'

// Define the CandidateInfo interface
interface CandidateInfo {
  name: string
  experience: string
  education: string
  skills: string
  activities: string[]
  yearsExperience: number
}

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

async function extractTextFromPDF(base64Data: string): Promise<string> {
  try {
    // Validate base64 data
    if (!base64Data || typeof base64Data !== 'string') {
      throw new Error('Invalid base64 data provided');
    }
    
    // Check if it looks like base64
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
      throw new Error('Invalid base64 format');
    }
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    console.log(`PDF buffer size: ${buffer.length} bytes`);
    
    // Convert buffer to string and extract readable text
    const textDecoder = new TextDecoder('utf-8');
    const rawText = textDecoder.decode(buffer);
    
    console.log(`Raw text length: ${rawText.length} characters`);
    console.log(`Raw text preview: ${rawText.substring(0, 200)}...`);
    
    // Extract text using regex patterns for PDF content
    let extractedText = '';
    
    // Method 1: Extract text from parentheses (common in PDFs)
    const parenMatches = rawText.match(/\(([^)]+)\)/g);
    if (parenMatches && parenMatches.length > 0) {
      const parenText = parenMatches
        .map(match => match.replace(/[\(\)]/g, ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (parenText.length > 50) {
        extractedText = parenText;
        console.log(`Extracted text from parentheses: ${extractedText.length} characters`);
      }
    }
    
    // Method 2: Extract readable words if parentheses method didn't work
    if (!extractedText || extractedText.length < 50) {
      const wordPattern = /[A-Za-z]{2,}/g;
      const words = rawText.match(wordPattern);
      if (words && words.length > 10) {
        const wordText = words.join(' ');
        if (wordText.length > 50) {
          extractedText = wordText;
          console.log(`Extracted text from words: ${extractedText.length} characters`);
        }
      }
    }
    
    // Method 3: Clean up the raw text if other methods failed
    if (!extractedText || extractedText.length < 50) {
      const cleanText = rawText
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Remove non-printable characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      if (cleanText.length > 50) {
        extractedText = cleanText;
        console.log(`Extracted text from cleanup: ${extractedText.length} characters`);
      }
    }
    
    // Validate that we got meaningful text
    if (!extractedText || extractedText.length < 10) {
      throw new Error('Could not extract meaningful text content from PDF');
    }
    
    console.log(`Final extracted text preview: ${extractedText.substring(0, 200)}...`);
    return extractedText;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function analyzeCV(fileName: string, fileContent: string, isBase64: boolean = false) {
  try {
    console.log(`Processing CV analysis for: ${fileName}`);
    console.log(`Received content length: ${fileContent.length} characters`);
    console.log(`Is base64: ${isBase64}`);
    console.log(`Base64 content preview: ${fileContent.substring(0, 100)}...`);
    
    // Convert PDF to string
    const cvText = await extractTextFromPDF(fileContent);
    console.log(`Analyzing CV: ${fileName} (${cvText.length} characters)`);
    console.log(`CV content preview: ${cvText.substring(0, 200)}...`);
    
    // Limit content to avoid token limits
    const limitedText = cvText.substring(0, 15000);
    
    // Single Mistral call to analyze everything
    const prompt = `Analyze this CV and provide a comprehensive evaluation. Return ONLY a JSON object with this exact structure:

{
  "candidateInfo": {
    "name": "Full name of the candidate",
    "experience": "Summary of work experience", 
    "education": "Educational background",
    "skills": "Technical and soft skills",
    "activities": ["activity1", "activity2"],
    "yearsExperience": number
  },
  "scores": [
    {"metric": "Interpersonal Skills", "score": number},
    {"metric": "Cognitive Abilities", "score": number},
    {"metric": "Emotional Intelligence", "score": number},
    {"metric": "Professional Qualities", "score": number},
    {"metric": "Cultural Fit", "score": number},
    {"metric": "Technical Aptitude", "score": number},
    {"metric": "Life Experience", "score": number}
  ],
  "averageScore": number,
  "analysis": "Detailed HR-style analysis of the candidate's strengths and areas for improvement"
}

CV Content:
${limitedText}

Evaluate each metric on a scale of 0-100 based on the CV content. If information is not found, use "Not specified" for text fields, [] for arrays, and 0 for numbers.`;

    console.log('🔑 Sending CV to Mistral for analysis...');
    
    const response = await callMistralAPI(prompt);
    console.log('AI response:', response);
    
    // Parse the response
    let result;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI analysis response');
    }
    
    // Validate and structure the result
    const analysis = {
      id: Date.now(),
      fileName: fileName,
      candidateName: result.candidateInfo?.name || 'Not specified',
      uploadDate: new Date().toISOString(),
      scores: result.scores || [],
      averageScore: result.averageScore || 0,
      analysis: result.analysis || 'Analysis not available'
    };
    
    console.log('CV analysis completed:', analysis);
    return analysis;
    
  } catch (error) {
    console.error('CV Analysis failed:', error)
    throw new Error('Failed to analyze CV. Please try again.')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, fileContent, isBase64 } = body;

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
    
    console.log(`Processing CV analysis for: ${fileName}`);
    console.log(`Received content length: ${fileContent.length} characters`);
    console.log(`Is base64: ${isBase64}`);
    
    if (isBase64) {
      console.log(`Base64 content preview: ${fileContent.substring(0, 100)}...`);
    } else {
      console.log(`Text content preview: ${fileContent.substring(0, 500)}...`);
    }
    
    const analysis = await analyzeCV(fileName, fileContent, isBase64);
    
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