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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null) // Clear any previous errors
    
    if (selectedFile) {
      // Check file type - only DOCX
      if (selectedFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setError("Please upload a DOCX document (.docx)")
        setFile(null)
        return
      }
      
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        setFile(null)
        return
      }
      
      setFile(selectedFile)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Convert file to base64 using FileReader API
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const result = reader.result as string;
            const base64Data = result.split(',')[1]; // Remove data URL prefix
            resolve(base64Data);
          } catch (error) {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      
      console.log('Sending file to API for parsing...');
      console.log(`File size: ${file.size} bytes, Base64 length: ${base64.length}`);
      
      // Call the CV analysis API with the file data
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: base64,
          isBase64: true
        })
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an invalid response. Please try again.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || errorData.details || 'Failed to analyze CV');
      }

      const analysis = await response.json()
      
      console.log('Analysis received:', analysis);
      
      // Validate the analysis response
      if (!analysis || !analysis.scores || !analysis.profile) {
        throw new Error('Invalid analysis response from server');
      }
      
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
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
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
              <CardDescription>Upload DOCX documents for comprehensive professional assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cv-upload">Select CV File</Label>
                <Input
                  id="cv-upload"
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  disabled={isAnalyzing}
                />
                <p className="text-sm text-slate-500">Supported format: DOCX (Max 10MB)</p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {file && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <FileText className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-slate-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}

              <Button 
                onClick={handleAnalyze} 
                disabled={!file || isAnalyzing} 
                className="w-full" 
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Conducting Professional Assessment...
                  </>
                ) : (
                  "Begin Professional Assessment"
                )}
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
