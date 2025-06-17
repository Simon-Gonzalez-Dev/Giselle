"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share2, User, Calendar, FileText, Briefcase, GraduationCap, Code, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { RadarChart } from "@/components/radar-chart"
import { BarChart } from "@/components/bar-chart"

interface CVAnalysis {
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

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("currentAnalysis")
    if (stored) {
      setAnalysis(JSON.parse(stored))
    }
  }, [])

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600 mb-4">No analysis data found</p>
            <Button onClick={() => router.push("/")}>Upload CV for Analysis</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-green-500"
    if (score >= 70) return "bg-blue-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return "Exceptional"
    if (score >= 75) return "Strong"
    if (score >= 65) return "Satisfactory"
    return "Developing"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upload
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Professional Assessment Results</h1>
              <p className="text-slate-600 mt-2">Comprehensive evaluation across seven key professional metrics</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Candidate Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="font-semibold">{analysis.candidateName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Document</p>
                <p className="font-semibold flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {analysis.fileName}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Assessment Date</p>
                <p className="font-semibold flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(analysis.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-2">{analysis.averageScore}/100</div>
                <Badge variant="secondary" className={`${getScoreColor(analysis.averageScore)} text-white`}>
                  {getPerformanceLevel(analysis.averageScore)}
                </Badge>
                <p className="text-sm text-slate-600 mt-3">Average across all assessment metrics</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Top Strength</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const topScore = analysis.scores.reduce((max, current) => (current.score > max.score ? current : max))
                return (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 mb-1">{topScore.metric}</div>
                    <div className="text-lg font-semibold text-blue-600 mb-2">{topScore.score}/100</div>
                    <p className="text-sm text-slate-600">Highest scoring competency area</p>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Current Experience</p>
                <p className="font-medium">{analysis.profile.experience}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Education</p>
                <p className="font-medium flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {analysis.profile.education}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Years of Experience</p>
                <p className="font-medium">{analysis.profile.yearsExperience} years</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Skills & Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Key Skills</p>
                <p className="font-medium">{analysis.profile.skills}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Community Involvement</p>
                <div className="space-y-1">
                  {analysis.profile.activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span className="text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Competency Radar Analysis</CardTitle>
              <CardDescription>Visual representation of performance across all metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart data={analysis.scores} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Score Breakdown</CardTitle>
              <CardDescription>Individual metric performance comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={analysis.scores} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Professional Assessment Summary</CardTitle>
            <CardDescription>Detailed analysis and recommendations based on evaluation criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-slate-700 leading-relaxed mb-6">
                {analysis.analysis}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Key Strengths</h4>
                  <ul className="space-y-2">
                    {analysis.scores
                      .filter((s) => s.score >= 80)
                      .map((score, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">
                            {score.metric} ({score.score}/100)
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Development Areas</h4>
                  <ul className="space-y-2">
                    {analysis.scores
                      .filter((s) => s.score < 75)
                      .map((score, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">
                            {score.metric} ({score.score}/100)
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => router.push("/")}>Analyze Another CV</Button>
          <Button variant="outline" onClick={() => router.push("/comparison")}>
            Compare with Others
          </Button>
        </div>
      </div>
    </div>
  )
}
