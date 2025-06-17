"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, TrendingUp, Users, Medal } from "lucide-react"
import { useRouter } from "next/navigation"

interface CVAnalysis {
  id: number
  fileName: string
  candidateName: string
  uploadDate: string
  scores: Array<{ metric: string; score: number }>
  averageScore: number
  analysis: string
}

export default function ComparisonPage() {
  const [cvHistory, setCvHistory] = useState<CVAnalysis[]>([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("cvHistory")
    if (stored) {
      const history = JSON.parse(stored)
      // Sort by average score descending
      setCvHistory(history.sort((a: CVAnalysis, b: CVAnalysis) => b.averageScore - a.averageScore))
    }
  }, [])

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

  const getTopPerformerByMetric = (metric: string) => {
    if (cvHistory.length === 0) return null
    return cvHistory.reduce((top, current) => {
      const currentScore = current.scores.find((s) => s.metric === metric)?.score || 0
      const topScore = top.scores.find((s) => s.metric === metric)?.score || 0
      return currentScore > topScore ? current : top
    })
  }

  const metrics = [
    "Interpersonal Skills",
    "Cognitive Abilities",
    "Emotional Intelligence",
    "Professional Qualities",
    "Cultural Fit",
    "Technical Aptitude",
    "Life Experience",
  ]

  if (cvHistory.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No CVs analyzed yet</p>
            <Button onClick={() => router.push("/")}>Upload First CV</Button>
          </CardContent>
        </Card>
      </div>
    )
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
              <h1 className="text-3xl font-bold text-slate-900">CV Comparison Dashboard</h1>
              <p className="text-slate-600 mt-2">Comprehensive ranking and analysis of all evaluated candidates</p>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {cvHistory.length} CVs Analyzed
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="font-semibold text-lg">{cvHistory[0]?.candidateName}</p>
                <p className="text-2xl font-bold text-slate-900 my-2">{cvHistory[0]?.averageScore}/100</p>
                <Badge className={`${getScoreColor(cvHistory[0]?.averageScore)} text-white`}>
                  {getPerformanceLevel(cvHistory[0]?.averageScore)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">
                  {Math.round(cvHistory.reduce((sum, cv) => sum + cv.averageScore, 0) / cvHistory.length)}
                </p>
                <p className="text-sm text-slate-600 mt-2">Across all candidates</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Medal className="h-5 w-5 text-green-500" />
                High Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">
                  {cvHistory.filter((cv) => cv.averageScore >= 80).length}
                </p>
                <p className="text-sm text-slate-600 mt-2">Score 80+ overall</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Total Evaluated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-slate-900">{cvHistory.length}</p>
                <p className="text-sm text-slate-600 mt-2">Candidates assessed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Overall Leaderboard</CardTitle>
              <CardDescription>Candidates ranked by average performance across all metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cvHistory.slice(0, 10).map((cv, index) => (
                  <div key={cv.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-amber-600"
                                : "bg-slate-400"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{cv.candidateName}</p>
                        <p className="text-sm text-slate-600">{cv.fileName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{cv.averageScore}</p>
                      <Badge variant="secondary" className={`${getScoreColor(cv.averageScore)} text-white text-xs`}>
                        {getPerformanceLevel(cv.averageScore)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metric Champions</CardTitle>
              <CardDescription>Top performers in each assessment category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.map((metric) => {
                  const topPerformer = getTopPerformerByMetric(metric)
                  const score = topPerformer?.scores.find((s) => s.metric === metric)?.score || 0

                  return (
                    <div key={metric} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{metric}</p>
                        <p className="text-xs text-slate-600">{topPerformer?.candidateName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{score}/100</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Comparison Matrix</CardTitle>
            <CardDescription>Complete performance breakdown across all candidates and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold">Candidate</th>
                    <th className="text-center p-2 font-semibold">Overall</th>
                    {metrics.map((metric) => (
                      <th key={metric} className="text-center p-2 font-semibold text-xs">
                        {metric.split(" ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cvHistory.map((cv, index) => (
                    <tr key={cv.id} className={`border-b ${index < 3 ? "bg-slate-50" : ""}`}>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {index < 3 && (
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs ${
                                index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-600"
                              }`}
                            >
                              {index + 1}
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{cv.candidateName}</p>
                            <p className="text-xs text-slate-600">{cv.fileName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <span className="font-bold">{cv.averageScore}</span>
                      </td>
                      {metrics.map((metric) => {
                        const score = cv.scores.find((s) => s.metric === metric)?.score || 0
                        return (
                          <td key={metric} className="text-center p-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                score >= 85
                                  ? "bg-green-100 text-green-800"
                                  : score >= 70
                                    ? "bg-blue-100 text-blue-800"
                                    : score >= 60
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {score}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button onClick={() => router.push("/")}>Analyze New CV</Button>
        </div>
      </div>
    </div>
  )
}
