export interface StockData {
    name: string
    price: number
    change: number
    changePercent: number
    volume: string
    marketCap: string
    pe: number
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

export type PeriodKey = "monthly" | "weekly" | "biweekly"