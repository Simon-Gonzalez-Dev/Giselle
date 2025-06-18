"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, BarChart3, Users } from "lucide-react"
import { useRouter } from "next/navigation"

// Enhanced scoring rubrics for each metric
const SCORING_RUBRICS = {
  "Interpersonal Skills": {
    criteria: ["Communication", "Leadership", "Collaboration"],
    keywords: ["team", "lead", "manage", "communicate", "present", "speak", "write", "collaborate", "coordinate"],
    weight: 1
  },
  "Cognitive Abilities": {
    criteria: ["Analytical thinking", "Creativity", "Learning ability"],
    keywords: ["analyze", "research", "solve", "create", "innovate", "learn", "study", "problem", "strategy"],
    weight: 1
  },
  "Emotional Intelligence": {
    criteria: ["Self-awareness", "Social awareness", "Emotional regulation"],
    keywords: ["empathy", "emotional", "awareness", "self", "social", "relationship", "understanding", "compassion"],
    weight: 1
  },
  "Professional Qualities": {
    criteria: ["Work ethic", "Adaptability", "Entrepreneurial spirit"],
    keywords: ["dedicated", "hardworking", "adapt", "flexible", "entrepreneur", "initiative", "drive", "motivated"],
    weight: 1
  },
  "Cultural Fit": {
    criteria: ["Team culture", "Organizational values", "Work style"],
    keywords: ["startup", "fast-paced", "growth", "culture", "values", "team", "collaborative", "flexible", "innovative"],
    weight: 1
  },
  "Technical Aptitude": {
    criteria: ["Problem-solving", "Learning capacity", "Innovation"],
    keywords: ["technical", "programming", "software", "technology", "code", "develop", "build", "create", "innovate"],
    weight: 1
  },
  "Life Experience": {
    criteria: ["Personal growth", "Diversity exposure", "Personal development"],
    keywords: ["volunteer", "travel", "diverse", "culture", "experience", "growth", "development", "international"],
    weight: 1
  }
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = [
        "application/pdf"
      ]
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
      } else {
        alert("Please upload a PDF document (.pdf)")
      }
    }
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Simple text extraction from PDF using regex patterns
          const textDecoder = new TextDecoder('utf-8');
          const pdfText = textDecoder.decode(uint8Array);
          
          // Multiple regex patterns to extract text from different PDF formats
          const textPatterns = [
            /\(\(([^)]+)\)\)/g,  // Pattern 1: Double parentheses
            /\(([^)]+)\)/g,      // Pattern 2: Single parentheses
            /\[([^\]]+)\]/g,     // Pattern 3: Square brackets
            /BT\s*([^E]+)ET/g,   // Pattern 4: PDF text objects
            /Td\s*\(([^)]+)\)/g, // Pattern 5: Text positioning
          ];
          
          let extractedText = '';
          
          for (const pattern of textPatterns) {
            const matches = pdfText.match(pattern) || [];
            if (matches.length > 0) {
              const patternText = matches
                .map(match => match.replace(/[\(\)\[\]]/g, ''))
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
              
              if (patternText.length > extractedText.length) {
                extractedText = patternText;
              }
            }
          }
          
          if (extractedText.length < 10) {
            // Fallback: try to extract any readable text
            const fallbackText = pdfText
              .replace(/[^\x20-\x7E\n\r\t]/g, '') // Remove non-printable characters
              .replace(/\s+/g, ' ')
              .trim();
            
            if (fallbackText.length > 10) {
              resolve(fallbackText);
            } else {
              reject(new Error('Could not extract text from PDF. Please ensure the PDF contains selectable text.'));
            }
          } else {
            resolve(extractedText);
          }
        } catch (error) {
          reject(new Error('Failed to read PDF file. Please try again.'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file. Please try again.'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)

    try {
      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file);
      
      // Call the CV analysis API
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: extractedText
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze CV')
      }

      const analysis = await response.json()
      
      // Store the analysis data
      localStorage.setItem("currentAnalysis", JSON.stringify(analysis))

      // Store in history
      const history = JSON.parse(localStorage.getItem("cvHistory") || "[]")
      history.push(analysis)
      localStorage.setItem("cvHistory", JSON.stringify(history))

      setIsAnalyzing(false)
      router.push("/analysis")
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Failed to analyze CV. Please try again.')
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Professional CV Evaluator</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Advanced AI-powered assessment tool for comprehensive candidate evaluation across seven key professional
            metrics
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Upload className="h-6 w-6" />
                Upload CV for Analysis
              </CardTitle>
              <CardDescription>Upload PDF documents for comprehensive professional assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cv-upload">Select CV File</Label>
                <Input
                  id="cv-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-slate-500">Supported format: PDF (Max 10MB)</p>
              </div>

              {file && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <FileText className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
              )}

              <Button onClick={handleAnalyze} disabled={!file || isAnalyzing} className="w-full" size="lg">
                {isAnalyzing ? "Conducting Professional Assessment..." : "Begin Professional Assessment"}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Assessment Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.keys(SCORING_RUBRICS).map((metric, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm font-medium">{metric}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/comparison")}>
                  View CV Comparison Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/analysis")}>
                  View Latest Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
