"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, TrendingUp, TrendingDown } from "lucide-react"
import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Brush } from "recharts"
import { MonthlyChangeChart } from "@/components/monthly-change-chart" // 確保路徑正確

interface StockData {
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
  pe: number
  // 這些原始的 chartData 和 volumeData 可能會被新的按時間範圍的數據取代，
  // 但為了兼容性，我們暫時保留它們，儘管在新的邏輯中可能不再直接使用
  chartData: Array<{ time: string; price: number }>
  volumeData: Array<{ time: string; volume: number }>
  monthlyData: Array<{
    averageClose: number
    averageVolume: number
    closeGrowthRate: number
    volumeGrowthRate: number
    date: string
  }>
  weeklyData: Array<{
    averageClose: number
    averageVolume: number
    closeGrowthRate: number
    volumeGrowthRate: number
    date: string
  }>
  biweeklyData: Array<{
    averageClose: number
    averageVolume: number
    closeGrowthRate: number
    volumeGrowthRate: number
    date: string
  }>
  news: Array<{ title: string; time: string; source: string }>
}

const tickers = ["AAPL", "GOOGL", "TSLA", "NVDA", "QQQ", "SPY", "SCHG"]
type PeriodKey = "monthly" | "weekly" | "biweekly"

export default function StockDashboard() {
  const [selectedTicker, setSelectedTicker] = useState("AAPL")
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("monthly") // 新增：選定的時間範圍狀態

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/data/${selectedTicker}.json`)
        const data = await response.json()
        setStockData(data)
      } catch (error) {
        console.error("Error fetching stock data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStockData()
  }, [selectedTicker])

  if (loading || !stockData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading stock data...</p>
        </div>
      </div>
    )
  }

  const isPositive = stockData.change > 0

  // 根據 selectedPeriod 準備 Price Chart 和 Volume Chart 的數據
  const getChartDataForPeriod = (period: PeriodKey) => {
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
        dataArray = stockData.monthlyData // 預設為 monthly
    }
    // 確保數據按日期排序，以正確繪製圖表
    return [...dataArray].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const currentPeriodData = getChartDataForPeriod(selectedPeriod)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Stock Dashboard</h1>
            <div className="flex items-center gap-4">
              <Select value={selectedTicker} onValueChange={setSelectedTicker}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select ticker" />
                </SelectTrigger>
                <SelectContent>
                  {tickers.map((ticker) => (
                    <SelectItem key={ticker} value={ticker}>
                      {ticker}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stock Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Price</CardTitle>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stockData.price}</div>
              <p className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? "+" : ""}
                {stockData.change} ({isPositive ? "+" : ""}
                {stockData.changePercent}%)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData.volume}</div>
              <p className="text-xs text-muted-foreground">24h trading volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData.marketCap}</div>
              <p className="text-xs text-muted-foreground">Total market value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">P/E Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData.pe}</div>
              <p className="text-xs text-muted-foreground">Price to earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Price Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Price Chart</CardTitle>
                  <CardDescription>Price movement over time</CardDescription>
                </div>
                {/* 新增時間範圍選擇 */}
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
                    <LineChart data={currentPeriodData}> {/* 使用 currentPeriodData */}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => value.slice(5)} /> {/* 使用 date 字段，並格式化顯示月份和日期 */}
                      <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="averageClose" stroke={isPositive ? "#16a34a" : "#dc2626"} strokeWidth={2} /> {/* 使用 averageClose */}
                      <Brush dataKey="date" height={20} stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Volume Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Volume Chart</CardTitle>
                  <CardDescription>Trading volume over time</CardDescription>
                </div>
                {/* 新增時間範圍選擇 */}
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
                    <BarChart data={currentPeriodData}> {/* 使用 currentPeriodData */}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => value.slice(5)} /> {/* 使用 date 字段，並格式化顯示月份和日期 */}
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="averageVolume" fill="hsl(var(--primary))" /> {/* 使用 averageVolume */}
                      <Brush dataKey="date" height={20} stroke="#8884d8" />
                      
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Period Change Analysis Chart (保持不變) */}
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

        {/* Stock Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Details</CardTitle>
            <CardDescription>
              Key metrics for {selectedTicker} - {stockData.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Current Price</TableCell>
                  <TableCell>${stockData.price}</TableCell>
                  <TableCell>
                    <Badge variant={isPositive ? "default" : "destructive"}>{isPositive ? "Up" : "Down"}</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Daily Change</TableCell>
                  <TableCell className={isPositive ? "text-green-600" : "text-red-600"}>
                    {isPositive ? "+" : ""}
                    {stockData.change} ({isPositive ? "+" : ""}
                    {stockData.changePercent}%)
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{Math.abs(stockData.changePercent) > 2 ? "High" : "Normal"}</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Volume</TableCell>
                  <TableCell>{stockData.volume}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Market Cap</TableCell>
                  <TableCell>{stockData.marketCap}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Large Cap</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* News Section */}
        <Card>
          <CardHeader>
            <CardTitle>Related News</CardTitle>
            <CardDescription>
              Latest news for {selectedTicker} - {stockData.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockData.news.map((article, index) => (
                <div key={index} className="flex flex-col space-y-2 border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-sm md:text-base hover:text-primary cursor-pointer">
                    {article.title}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
                    <span>{article.source}</span>
                    <span>{article.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}