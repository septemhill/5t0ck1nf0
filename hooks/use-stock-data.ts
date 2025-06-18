import { useState, useEffect } from "react"
import { StockData } from "@/types/stock"

export function useStockData(ticker: string) {
    const [stockData, setStockData] = useState<StockData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!ticker) return

        const fetchStockData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/data/${ticker}.json`)
                const data = await response.json()
                setStockData(data)
            } catch (error) {
                console.error("Error fetching stock data:", error)
                setStockData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchStockData()
    }, [ticker])

    return { stockData, loading }
}