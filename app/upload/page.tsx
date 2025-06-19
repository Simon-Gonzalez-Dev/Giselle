"use client"

import type React from "react"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, CheckCircle, AlertCircle, User, Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { CVScoringEngine, parseCV } from "@/lib/scoring-engine"

const jobPositions = [
  "Senior Developer",
  "Product Manager",
  "UX Designer",
  "Data Analyst",
  "Marketing Manager",
  "Sales Representative",
]

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedJob, setSelectedJob] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const { toast } = useToast()

  const [extractedData, setExtractedData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    scores: {
      interpersonalSkills: 88,
      cognitiveAbilities: 95,
      emotionalIntelligence: 82,
      professionalQualities: 90,
      culturalFit: 94,
      technicalAptitude: 98,
      lifeExperience: 85,
    },
    overallScore: 92,
  })

  const processingSteps = [
    "Uploading file...",
    "Extracting text content...",
    "Parsing candidate information...",
    "Analyzing skills and experience...",
    "Calculating scores...",
    "Finalizing analysis...",
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setAnalysisComplete(false)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && (file.type === "application/pdf" || file.type.includes("document"))) {
      setSelectedFile(file)
      setAnalysisComplete(false)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const processCV = async () => {
    if (!selectedFile || !selectedJob) {
      toast({
        title: "Missing Information",
        description: "Please select a file and job position.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProcessingStep(0)

    // Simulate processing steps
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(i)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setIsProcessing(false)
    setAnalysisComplete(true)

    toast({
      title: "Analysis Complete",
      description: "CV has been successfully analyzed and scored.",
    })
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-xl font-semibold">CV Upload & Analysis</h1>
      </header>

      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>
                Upload a PDF or Word document to automatically extract and analyze candidate information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-position">Job Position</Label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job position" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobPositions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">{selectedFile ? selectedFile.name : "Drop your resume here"}</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                  <p className="text-xs text-muted-foreground">Supports PDF, DOC, and DOCX files up to 10MB</p>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              )}

              <Button onClick={processCV} disabled={!selectedFile || !selectedJob || isProcessing} className="w-full">
                {isProcessing ? "Processing..." : "Analyze Resume"}
              </Button>
            </CardContent>
          </Card>

          {/* Processing Status */}
          {isProcessing && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Resume</CardTitle>
                <CardDescription>Analyzing candidate information and calculating scores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(((processingStep + 1) / processingSteps.length) * 100)}%</span>
                  </div>
                  <Progress value={((processingStep + 1) / processingSteps.length) * 100} />
                </div>
                <div className="space-y-2">
                  {processingSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {index < processingStep ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : index === processingStep ? (
                        <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-muted rounded-full" />
                      )}
                      <span
                        className={`text-sm ${index <= processingStep ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysisComplete && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>Extracted information and scoring results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Extracted Information */}
                <div className="space-y-3">
                  <h4 className="font-medium">Extracted Information</h4>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{extractedData.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{extractedData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{extractedData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{extractedData.location}</span>
                    </div>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="space-y-2">
                  <h4 className="font-medium">Overall Score</h4>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold text-green-600">{extractedData.overallScore}</div>
                    <div className="flex-1">
                      <Progress value={extractedData.overallScore} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">Excellent candidate match</p>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium">Score Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(extractedData.scores).map(([metric, score]) => (
                      <div key={metric} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{metric.replace(/([A-Z])/g, " $1").trim()}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={score} className="w-16 h-2" />
                          <span className="text-sm font-medium w-8">{score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Add to Pipeline</Button>
                  <Button variant="outline">View Full Profile</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tips and Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Tips for Better Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Clear Text</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure the resume has clear, readable text without heavy formatting
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Complete Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Include contact details, experience, and education sections
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">File Size</h4>
                  <p className="text-sm text-muted-foreground">Keep files under 10MB for optimal processing speed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
