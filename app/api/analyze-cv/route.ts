/// <reference types="node" />

import { NextRequest, NextResponse } from 'next/server'
import { Mistral } from '@mistralai/mistralai'
import { createWorker } from 'tesseract.js'
import { PDFDocument } from 'pdf-lib'
import mammoth from 'mammoth'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

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

async function extractTextFromFile(base64Data: string, fileName: string): Promise<string> {
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
    console.log(`File buffer size: ${buffer.length} bytes`);
    
    // Determine file type from extension
    const fileExtension = path.extname(fileName).toLowerCase();
    
    if (fileExtension === '.docx') {
      // Handle DOCX files using mammoth
      console.log('Processing DOCX file with mammoth...');
      
      try {
        const result = await mammoth.extractRawText({ buffer });
        const extractedText = result.value;
        
        console.log(`DOCX extracted text length: ${extractedText.length} characters`);
        console.log(`DOCX text preview: ${extractedText.substring(0, 200)}...`);
        
        if (extractedText && extractedText.trim().length > 10) {
          const cleanedText = extractedText
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          return cleanedText;
        } else {
          throw new Error('Could not extract meaningful text from DOCX file');
        }
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        throw new Error(`Failed to parse DOCX: ${docxError instanceof Error ? docxError.message : 'Unknown error'}`);
      }
      
    } else if (fileExtension === '.pdf') {
      // Handle PDF files (fallback to current method)
      console.log('Processing PDF file...');
      
      try {
        const pdfDoc = await PDFDocument.load(buffer);
        const pages = pdfDoc.getPages();
        console.log(`PDF has ${pages.length} pages`);
        
        // Try to extract any readable text from the PDF buffer
        const pdfText = buffer.toString('utf8');
        
        // Look for text content in PDF structure
        const textMatches = pdfText.match(/\([^)]{3,}\)/g);
        if (textMatches && textMatches.length > 20) {
          // This might be a text-based PDF, try to extract meaningful content
          const extractedText = textMatches
            .map(match => match.slice(1, -1)) // Remove parentheses
            .filter(text => text.length > 2 && /[a-zA-Z]/.test(text)) // Filter meaningful text
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (extractedText.length > 100) {
            console.log(`PDF extracted text length: ${extractedText.length} characters`);
            console.log(`PDF text preview: ${extractedText.substring(0, 200)}...`);
            return extractedText;
          }
        }
        
        // If text extraction failed, provide a meaningful error
        throw new Error('Text-based PDF extraction failed. Please convert to DOCX format for better results.');
        
      } catch (pdfError) {
        console.log('PDF-lib extraction failed:', pdfError);
        throw new Error('PDF processing failed. Please convert to DOCX format for better results.');
      }
      
    } else {
      throw new Error(`Unsupported file format: ${fileExtension}. Please upload a DOCX or PDF file.`);
    }
    
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function analyzeCV(fileName: string, cvText: string, isBase64: boolean = false) {
  try {
    console.log(`Processing CV analysis for: ${fileName}`);
    console.log(`Received content length: ${cvText.length} characters`);
    console.log(`Is base64: ${isBase64}`);
    
    let extractedText = cvText;
    
    // If it's base64 data, extract text from PDF
    if (isBase64) {
      console.log(`Base64 content preview: ${cvText.substring(0, 100)}...`);
      extractedText = await extractTextFromFile(cvText, fileName);
    } else {
      console.log(`Text content preview: ${cvText.substring(0, 200)}...`);
    }
    
    console.log(`Analyzing CV: ${fileName} (${extractedText.length} characters)`);
    console.log(`CV content preview: ${extractedText.substring(0, 200)}...`);
    
    // Limit content to avoid token limits
    const limitedText = extractedText.substring(0, 15000);
    
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
      analysis: result.analysis || 'Analysis not available',
      profile: {
        experience: result.candidateInfo?.experience || 'Not specified',
        education: result.candidateInfo?.education || 'Not specified',
        skills: result.candidateInfo?.skills || 'Not specified',
        activities: result.candidateInfo?.activities || [],
        yearsExperience: result.candidateInfo?.yearsExperience || 0
      }
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
    const { fileName, cvText, fileContent, isBase64 } = body;

    // Handle both old and new API formats
    const content = cvText || fileContent;
    const isBase64Content = isBase64 !== undefined ? isBase64 : !!fileContent;

    // Validate required fields
    if (!fileName || !content) {
      return new Response(
        JSON.stringify({ 
          error: 'File name and content are required',
          received: { 
            hasFileName: !!fileName, 
            hasContent: !!content,
            contentType: typeof content,
            isBase64: isBase64Content
          }
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    console.log(`Processing CV analysis for: ${fileName}`);
    console.log(`Received content length: ${content.length} characters`);
    console.log(`Is base64: ${isBase64Content}`);
    
    if (isBase64Content) {
      console.log(`Base64 content preview: ${content.substring(0, 100)}...`);
    } else {
      console.log(`Text content preview: ${content.substring(0, 500)}...`);
    }
    
    const analysis = await analyzeCV(fileName, content, isBase64Content);
    
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