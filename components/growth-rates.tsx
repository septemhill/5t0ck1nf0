import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataItem { // Renamed from WeeklyDataItem to be more general
  date: string
  closeGrowthRate: number // Assuming this is already a percentage (e.g., 1.5 for 1.5%)
  // Add other properties if needed, but only closeGrowthRate is used for calculation
}

interface GrowthRatesProps {
  weeklyData: DataItem[]
  monthlyData: DataItem[] // Added monthlyData
  biweeklyData: DataItem[] // Added biweeklyData
}

export function GrowthRates({ weeklyData, monthlyData, biweeklyData }: GrowthRatesProps) {
  const [selectedPeriodType, setSelectedPeriodType] = useState<'weekly' | 'monthly' | 'biweekly'>('weekly');

  const periods = [1, 2, 5, 10, 20, 30] // These periods will now represent the selected unit (weeks, months, or biweeks)
 
  const currentData = useMemo(() => {
    if (selectedPeriodType === 'monthly') return monthlyData;
    if (selectedPeriodType === 'biweekly') return biweeklyData;
    return weeklyData;
  }, [selectedPeriodType, monthlyData, biweeklyData, weeklyData]);

  const periodUnit = useMemo(() => {
    if (selectedPeriodType === 'monthly') return '月';
    if (selectedPeriodType === 'biweekly') return '雙週';
    return '週';
  }, [selectedPeriodType]);

  // Function to calculate geometric mean of growth rates
  const calculateGeometricMean = (data: DataItem[]): number | null => { // Changed type to DataItem
    if (data.length === 0) {
      return null
    }
    // Convert percentages to decimals (e.g., 1.5% -> 0.015) and add 1
    const product = data.reduce((acc, item) => acc * (1 + item.closeGrowthRate / 100), 1)
    // Calculate geometric mean and convert back to percentage
    return (Math.pow(product, 1 / data.length) - 1) * 100;
  }

  const growthRates = periods.map((period) => {
    // Get the last 'period' entries from currentData
    const relevantData = currentData.slice(-period)
    const geometricMean = calculateGeometricMean(relevantData)

    return {
      period,
      geometricMean: geometricMean !== null ? geometricMean.toFixed(2) : "N/A",
      dataPoints: relevantData.length,
      requiredPoints: period,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>平均成長率 (幾何平均)</CardTitle>
        <CardDescription>基於近期的{periodUnit}收盤價成長率計算</CardDescription>
        <div className="mt-4">
          <Select value={selectedPeriodType} onValueChange={(value: 'weekly' | 'monthly' | 'biweekly') => setSelectedPeriodType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="選擇期間" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">週</SelectItem>
              <SelectItem value="monthly">月</SelectItem>
              <SelectItem value="biweekly">雙週</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-center font-medium text-sm text-muted-foreground">
          <div>期間 ({periodUnit})</div>
          <div>平均成長率 (%)</div>
          <div>資料點數</div>
        </div>
        <div className="mt-2 space-y-2">
          {growthRates.map((rate) => (
            <div key={rate.period} className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>{rate.period}</div>
              <div
                className={
                  rate.geometricMean !== "N/A" && parseFloat(rate.geometricMean) >= 0
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {rate.geometricMean !== "N/A" ? `${rate.geometricMean}%` : "資料不足"}
              </div>
              <div className="text-muted-foreground">
                {rate.dataPoints}/{rate.requiredPoints}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}