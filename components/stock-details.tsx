import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { StockData } from "@/types/stock"

interface StockDetailsProps {
  stockData: StockData
}

export function StockDetails({ stockData }: StockDetailsProps) {
  const isPositive = stockData.change > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Details</CardTitle>
        <CardDescription>
          Key metrics for {stockData.name}
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
  )
}