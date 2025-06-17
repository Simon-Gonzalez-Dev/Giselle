"use client"

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RadarChartProps {
  data: Array<{ metric: string; score: number }>
}

export function RadarChart({ data }: RadarChartProps) {
  const chartData = data.map((item) => ({
    metric: item.metric.split(" ")[0], // Shorten labels for better display
    score: item.score,
    fullMetric: item.metric,
  }))

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} className="text-xs" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} tickCount={6} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value, payload) => {
                  const item = payload?.[0]?.payload
                  return item?.fullMetric || value
                }}
              />
            }
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
