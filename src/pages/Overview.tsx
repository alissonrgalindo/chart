import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TooltipProps} from "recharts";
import { useOverview } from "@/hooks/useOverview";
import { normalizeOverview } from "@/utils/normalizeOverview";
import { calculateOverviewStats } from "@/utils/calculateOverviewStats";
import { formatCurrency, formatNumber } from "@/utils/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChartIcon,
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  RefreshCwIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground p-3 rounded-md border shadow-sm">
        <p className="font-medium mb-1 capitalize">{label}</p>
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4f46e5]" />
            <span>Installs: {formatNumber(payload[0].value)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]" />
            <span>Revenue: {formatCurrency(payload[1].value)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const GrowthIndicator = ({ 
  value, 
  suffix = "%" 
}: { 
  value: number; 
  suffix?: string; 
}) => {
  const isPositive = value >= 0;
  return (
    <Badge 
      className={`flex items-center gap-1 ${isPositive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`} 
      variant="outline"
    >
      {isPositive ? (
        <TrendingUpIcon className="w-3.5 h-3.5" />
      ) : (
        <TrendingDownIcon className="w-3.5 h-3.5" />
      )}
      {isPositive ? '+' : ''}{value}{suffix}
    </Badge>
  );
};

const StatCard = ({ 
  title, 
  value, 
  growth, 
  icon: Icon,
  iconColor = "text-primary" 
}: { 
  title: string, 
  value: string, 
  growth: number, 
  icon: React.ElementType,
  iconColor?: string
}) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-sm text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-2xl font-bold mt-1">
            {value}
          </div>
        </div>
        <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex items-center gap-2">
        <GrowthIndicator value={growth} />
        <span className="text-xs text-muted-foreground">vs. last period</span>
      </div>
    </CardContent>
  </Card>
);

export default function Overview() {
  const { data, loading, error } = useOverview();
  
  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center">
        <div className="animate-spin mb-4">
          <RefreshCwIcon className="w-8 h-8 text-primary" />
        </div>
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-3">
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg">
          <h3 className="font-medium">Error loading data</h3>
          <p className="text-sm mt-1">{error}</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCwIcon className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const chartData = normalizeOverview(data.installs, data.revenue);
  const stats = calculateOverviewStats(data.installs, data.revenue);

  if (chartData.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center p-8 mb-4 rounded-full bg-muted">
          <BarChartIcon className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No data available</h3>
        <p className="text-muted-foreground mt-1">
          There is no data to display for the selected time period.
        </p>
        <Button variant="outline" className="mt-4" onClick={handleRefresh}>
          <RefreshCwIcon className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>
    );
  }

  const filteredChartData = (() => {
    return chartData;
  })();

  const avgRevenuePerInstall = stats.totalInstalls > 0 
    ? stats.totalRevenue / stats.totalInstalls 
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Analytics and performance metrics for your campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCwIcon className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Installs"
          value={formatNumber(stats.totalInstalls)}
          growth={10.5}
          icon={BarChartIcon}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          growth={7.2}
          icon={DollarSignIcon}
          iconColor="text-green-500"
        />
        <StatCard
          title="Daily Avg Installs"
          value={formatNumber(stats.averageInstalls)}
          growth={5.8}
          icon={BarChartIcon}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Revenue Per Install"
          value={formatCurrency(avgRevenuePerInstall)}
          growth={-3.2}
          icon={DollarSignIcon}
          iconColor="text-amber-500"
        />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Installs and revenue data over time
            </CardDescription>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-[#4f46e5] mr-2" />
              <span>Installs</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2" />
              <span>Revenue</span>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart 
              data={filteredChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false}
                dy={10}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1).substring(0, 2)}
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(value) => formatNumber(value)}
                tick={{ fontSize: 12 }}
                domain={[0, 'dataMax + 50']}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
                tick={{ fontSize: 12 }}
                domain={[0, 'dataMax + 10']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="installs"
                stroke="#4f46e5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#installs)"
                activeDot={{ r: 6 }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenue)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Management</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              View and manage all your active advertising campaigns.
            </p>
            <Button variant="outline" asChild className="w-full">
              <a href="/campaigns">
                View Campaigns <ArrowRightIcon className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Campaign</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Create a new campaign to start driving more installs.
            </p>
            <Button variant="outline" className="w-full">
              Create Campaign <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Configure your dashboard preferences and notifications.
            </p>
            <Button variant="outline" asChild className="w-full">
              <a href="/settings">
                Go to Settings <ArrowRightIcon className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}