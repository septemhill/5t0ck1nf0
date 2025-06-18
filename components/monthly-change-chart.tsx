"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Brush } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PeriodData {
  averageClose: number
  averageVolume: number
  closeGrowthRate: number
  volumeGrowthRate: number
  date: string
}

interface MonthlyChangeChartProps {
  monthlyData: PeriodData[]
  weeklyData: PeriodData[]
  biweeklyData: PeriodData[]
  ticker: string
}

type PeriodType = "monthly" | "weekly" | "biweekly"

export function MonthlyChangeChart({ monthlyData, weeklyData, biweeklyData, ticker }: MonthlyChangeChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("monthly")

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case "weekly":
        return weeklyData
      case "biweekly":
        return biweeklyData
      default:
        return monthlyData
    }
  }

  const formatDate = (dateString: string) => {
    if (selectedPeriod === "monthly") {
      const date = new Date(dateString + "-01")
      return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    } else {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "weekly":
        return "Weekly"
      case "biweekly":
        return "Bi-weekly"
      default:
        return "Monthly"
    }
  }

  const currentData = getCurrentData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const isPositive = data.closeGrowthRate >= 0
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">
            {selectedPeriod === "monthly"
              ? new Date(label + "-01").toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : new Date(label).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
          </p>
          <p className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            Price Change: {isPositive ? "+" : ""}
            {data.closeGrowthRate}%
          </p>
          <p className={`text-sm ${data.volumeGrowthRate >= 0 ? "text-green-600" : "text-red-600"}`}>
            Volume Change: {data.volumeGrowthRate >= 0 ? "+" : ""}
            {data.volumeGrowthRate}%
          </p>
          <div className="text-xs text-muted-foreground mt-1">
            <p>Avg Close: ${data.averageClose.toFixed(2)}</p>
            <p>Avg Volume: {(data.averageVolume / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{getPeriodLabel()} Change %</h3>
        <Select value={selectedPeriod} onValueChange={(value: PeriodType) => setSelectedPeriod(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Bi-weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} angle={-45} textAnchor="end" height={60} />
          <YAxis tickFormatter={(value) => `${value}%`} fontSize={12} domain={["dataMin - 2", "dataMax + 2"]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
          <Bar dataKey="closeGrowthRate" radius={[2, 2, 2, 2]}>
            {currentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.closeGrowthRate >= 0 ? "#16a34a" : "#dc2626"} fillOpacity={0.8} />
            ))}
          </Bar>
          <Brush dataKey="date" height={20} stroke="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
