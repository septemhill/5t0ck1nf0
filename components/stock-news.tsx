import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StockData } from "@/types/stock"

interface StockNewsProps {
  stockData: StockData
}

export function StockNews({ stockData }: StockNewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Related News</CardTitle>
        <CardDescription>
          Latest news for {stockData.name}
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
  )
}