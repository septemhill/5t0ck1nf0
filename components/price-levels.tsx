import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts"

interface PriceLevelsProps {
  currentPrice: number
}

export function PriceLevels({ currentPrice }: PriceLevelsProps) {
  console.log('currentPrice', currentPrice)
  const percentages = [0.5, 0.7, 0.9, 1, 1.3, 1.5, 2, 2.3, 2.6, 2.9, 3, 3.5, 4, 4.3]

  const levels = percentages.map((p) => {
    const changeAmount = currentPrice * (p / 100)
    return {
      percentage: p,
      upPrice: currentPrice + changeAmount,
      downPrice: currentPrice - changeAmount,
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload // Access the original data object for the current percentage
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg text-sm">
          <p className="font-medium">百分比: {label}%</p>
          <p className="text-green-600">上漲價格: ${data.upPrice.toFixed(2)}</p>
          <p className="text-red-600">下跌價格: ${data.downPrice.toFixed(2)}</p>
          <p className="text-muted-foreground">當前價格: ${currentPrice.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>價格水平</CardTitle>
        <CardDescription>以當前價格為基準的各個百分比價格水平</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={levels}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="percentage" label={{ value: "百分比 (%)", position: "insideBottom", offset: 0 }} />
            <YAxis
              domain={[(dataMin: number) => (dataMin * 0.99).toFixed(2), (dataMax: number) => (dataMax * 1.01).toFixed(2)]}
              tickCount={8} tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={currentPrice} stroke="#8884d8" strokeDasharray="3 3" label={`當前價格: $${currentPrice.toFixed(2)}`} />
            <Line type="monotone" dataKey="upPrice" stroke="#22c55e" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="downPrice" stroke="#ef4444" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}