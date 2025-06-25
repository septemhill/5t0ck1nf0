import { useState, useEffect } from "react"
import { StockData } from "@/types/stock"

export function useStockData(ticker: string) {
    // Define the base URL for production deployment on GitHub Pages
    const PRODUCTION_BASE_URL = "https://septemhill.github.io/5t0ck1nf0";

    const [stockData, setStockData] = useState<StockData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!ticker) return

        const fetchStockData = async () => {
            setLoading(true)

            // Determine the base path based on the environment
            let url = `/data/${ticker}.json`; // Default to local development path

            if (process.env.NODE_ENV === 'production') {
                // For production, use the absolute path for GitHub Pages
                url = `${PRODUCTION_BASE_URL}/data/${ticker}.json`;
            }

            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} for ${url}`);
                }
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