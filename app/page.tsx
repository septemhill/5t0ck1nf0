"use client"

import { useState } from "react"
import { useStockData } from "@/hooks/use-stock-data"
import { DashboardHeader } from "@/components/dashboard-header"
import { StockOverview } from "@/components/stock-overview"
import { StockCharts } from "@/components/stock-charts"
import { StockDetails } from "@/components/stock-details"
import { StockNews } from "@/components/stock-news"

const tickers = ["AAPL", "GOOGL", "TSLA", "NVDA", "QQQ", "SPY", "SCHG"]

export default function StockDashboard() {
  const [selectedTicker, setSelectedTicker] = useState("AAPL")
  const { stockData, loading } = useStockData(selectedTicker)

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

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        selectedTicker={selectedTicker}
        onTickerChange={setSelectedTicker}
        tickers={tickers}
      />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <StockOverview stockData={stockData} />
        <StockCharts stockData={stockData} selectedTicker={selectedTicker} />
        <StockDetails stockData={stockData} />
        <StockNews stockData={stockData} />
      </main>
    </div>
  )
}