"use client"

import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BarChartProps {
  data: Array<{ metric: string; score: number }>
}

export function BarChart({ data }: BarChartProps) {
  const chartData = data.map((item) => ({
    metric: item.metric.split(" ")[0], // Shorten labels
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
        <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="metric" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Bar dataKey="score" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
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
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
