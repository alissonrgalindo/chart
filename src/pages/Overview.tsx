import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useOverview } from "@/hooks/useOverview"
import { normalizeOverview } from "@/utils/normalizeOverview"
import { calculateOverviewStats } from "@/utils/calculateOverviewStats"
import { formatCurrency, formatNumber } from "@/utils/format"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChartIcon,
  DollarSignIcon,
} from "lucide-react"

export default function Overview() {
  const { data, loading, error } = useOverview()

  if (loading) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>
  if (!data) return null

  const chartData = normalizeOverview(data.installs, data.revenue)
  const stats = calculateOverviewStats(data.installs, data.revenue)

  if (chartData.length === 0) {
    return <p className="p-4">No data available</p>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="relative">
            <CardTitle className="text-sm text-muted-foreground">
              Total Installs
            </CardTitle>
            <div className="text-2xl font-bold">
              {formatNumber(stats.totalInstalls)}
            </div>
            <Badge className="absolute top-4 right-4" variant="outline">
              <BarChartIcon className="w-4 h-4 mr-1" /> +100%
            </Badge>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="relative">
            <CardTitle className="text-sm text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <Badge className="absolute top-4 right-4" variant="outline">
              <DollarSignIcon className="w-4 h-4 mr-1" /> +10%
            </Badge>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Daily Avg (Installs)
            </CardTitle>
            <div className="text-2xl font-bold">
              {formatNumber(stats.averageInstalls)}
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Daily Avg (Revenue)
            </CardTitle>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.averageRevenue)}
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Installs and Revenue per Day</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <title>Chart showing installs and revenue per day</title>
              <defs>
                <linearGradient id="installs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="installs"
                stroke="#4f46e5"
                fill="url(#installs)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fill="url(#revenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
