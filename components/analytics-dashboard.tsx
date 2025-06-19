"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Clock, Award, Target, Mail } from "lucide-react"
import { useState } from "react"

interface AnalyticsProps {
  timeRange?: '7d' | '30d' | '90d' | '1y'
}

const pipelineData = [
  { stage: 'Applied', count: 45, percentage: 100, color: 'bg-gray-500' },
  { stage: 'Phone Screen', count: 28, percentage: 62, color: 'bg-blue-500' },
  { stage: 'Technical', count: 18, percentage: 40, color: 'bg-yellow-500' },
  { stage: 'Final Interview', count: 12, percentage: 27, color: 'bg-green-500' },
  { stage: 'Offered', count: 8, percentage: 18, color: 'bg-purple-500' },
  { stage: 'Hired', count: 5, percentage: 11, color: 'bg-cyan-500' }
]

const scoreDistribution = [
  { range: '90-100', count: 12, percentage: 15 },
  { range: '80-89', count: 28, percentage: 35 },
  { range: '70-79', count: 25, percentage: 31 },
  { range: '60-69', count: 10, percentage: 13 },
  { range: '50-59', count: 5, percentage: 6 }
]

const topSkills = [
  { skill: 'JavaScript', count: 45, percentage: 75 },
  { skill: 'React', count: 38, percentage: 63 },
  { skill: 'Python', count: 32, percentage: 53 },
  { skill: 'Node.js', count: 28, percentage: 47 },
  { skill: 'AWS', count: 25, percentage: 42 },
  { skill: 'TypeScript', count: 22, percentage: 37 }
]

const departmentBreakdown = [
  { department: 'Engineering', count: 35, percentage: 44 },
  { department: 'Product', count: 18, percentage: 23 },
  { department: 'Design', count: 12, percentage: 15 },
  { department: 'Marketing', count: 8, percentage: 10 },
  { department: 'Sales', count: 7, percentage: 8 }
]

export default function AnalyticsDashboard({ timeRange = '30d' }: AnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState('overall')

  const kpis = [
    {
      title: 'Conversion Rate',
      value: '11%',
      change: '+2.5%',
      trend: 'up' as const,
      description: 'Applied to Hired',
      icon: Target
    },
    {
      title: 'Time to Hire',
      value: '18 days',
      change: '-3 days',
      trend: 'up' as const,
      description: 'Average hiring time',
      icon: Clock
    },
    {
      title: 'Quality Score',
      value: '79.5',
      change: '+4.2',
      trend: 'up' as const,
      description: 'Avg. candidate score',
      icon: Award
    },
    {
      title: 'Response Rate',
      value: '68%',
      change: '+5%',
      trend: 'up' as const,
      description: 'Email responses',
      icon: Mail
    }
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {kpi.change}
                </span>
                <span className="ml-1">{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Pipeline Funnel */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Hiring Pipeline</CardTitle>
            <CardDescription>Candidate progression through stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineData.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">{stage.count} candidates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${stage.color}`} />
                    <Progress value={stage.percentage} className="flex-1" />
                    <span className="text-sm font-medium">{stage.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Candidates by Department</CardTitle>
            <CardDescription>Distribution across roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentBreakdown.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between">
                  <span className="font-medium">{dept.department}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={dept.percentage} className="w-20" />
                    <span className="text-sm text-muted-foreground">{dept.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Candidate scoring breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scoreDistribution.map((item) => (
                <div key={item.range} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.range}</Badge>
                    <span className="text-sm">{item.count} candidates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={item.percentage * 2} className="w-16" />
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Most Common Skills</CardTitle>
            <CardDescription>Skills across all candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSkills.map((skill) => (
                <div key={skill.skill} className="flex items-center justify-between">
                  <span className="font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={skill.percentage} className="w-20" />
                    <span className="text-sm text-muted-foreground">{skill.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Analysis</CardTitle>
          <CardDescription>Detailed breakdown of candidate progression</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineData.map((stage, index) => (
              <div key={stage.stage} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                  <div>
                    <h4 className="font-medium">{stage.stage}</h4>
                    <p className="text-sm text-muted-foreground">
                      {stage.count} candidates ({stage.percentage}% of total)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {index > 0 && (
                    <div className="text-sm text-muted-foreground">
                      -{pipelineData[index - 1].count - stage.count} from previous
                    </div>
                  )}
                  <Progress value={stage.percentage} className="w-24 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hiring Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Average Time to Hire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18 days</div>
            <div className="text-sm text-muted-foreground">3 days faster than last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">67%</div>
            <div className="text-sm text-muted-foreground">Interviews to offers</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offer Acceptance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">88%</div>
            <div className="text-sm text-muted-foreground">Offers accepted</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 