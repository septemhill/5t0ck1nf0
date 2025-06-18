import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { StockData } from "@/types/stock"

interface StockOverviewProps {
  stockData: StockData
}

export function StockOverview({ stockData }: StockOverviewProps) {
  const isPositive = stockData.change > 0

  return (
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
  )
}