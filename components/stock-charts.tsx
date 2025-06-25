"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Brush } from "recharts"
import { StockData, PeriodKey } from "@/types/stock"
import { MonthlyChangeChart } from "@/components/monthly-change-chart"

interface StockChartsProps {
  stockData: StockData
  selectedTicker: string
}

const getChartDataForPeriod = (stockData: StockData, period: PeriodKey) => {
  let dataArray: Array<{ date: string; averageClose: number; averageVolume: number }>
  switch (period) {
    case "monthly":
      dataArray = stockData.monthlyData
      break
    case "weekly":
      dataArray = stockData.weeklyData
      break
    case "biweekly":
      dataArray = stockData.biweeklyData
      break
    default:
      dataArray = stockData.monthlyData
  }
  return [...dataArray].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function StockCharts({ stockData, selectedTicker }: StockChartsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("monthly")
  const currentPeriodData = getChartDataForPeriod(stockData, selectedPeriod)
  const isPositive = stockData.change > 0

  return (
    <div className="grid gap-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Price Chart</CardTitle>
              <CardDescription>Price movement over time</CardDescription>
            </div>
            <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as PeriodKey)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentPeriodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => value.slice(5)} />
                  <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="averageClose" stroke={isPositive ? "#16a34a" : "#dc2626"} strokeWidth={2} />
                  <Brush dataKey="date" height={20} stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Volume Chart</CardTitle>
              <CardDescription>Trading volume over time</CardDescription>
            </div>
            <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as PeriodKey)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentPeriodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => value.slice(5)} />
                  <YAxis tickFormatter={(value) => {
                    if (typeof value === 'number') {
                      if (value >= 1000000000) {
                        return (value / 1000000000).toFixed(1) + 'B';
                      } else if (value >= 1000000) {
                        return (value / 1000000).toFixed(1) + 'M';
                      } else if (value >= 1000) {
                        return (value / 1000).toFixed(1) + 'K';
                      } else {
                        return value;
                      }
                    } else {
                      return value;
                    }
                  }} />
                  <Tooltip />
                  <Bar dataKey="averageVolume" fill="hsl(var(--primary))" />
                  <Brush dataKey="date" height={20} stroke="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Period Change Analysis</CardTitle>
          <CardDescription>Price change analysis with multiple time periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <MonthlyChangeChart
              monthlyData={stockData.monthlyData}
              weeklyData={stockData.weeklyData}
              biweeklyData={stockData.biweeklyData}
              ticker={selectedTicker}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}