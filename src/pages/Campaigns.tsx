import { useEffect, useState } from "react"
import { useCampaigns } from "@/hooks/useCampaigns"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

export default function Campaigns() {
  const { campaigns, loading, error } = useCampaigns()
  const [selectedId, setSelectedId] = useState<string | null>(
    localStorage.getItem("selectedCampaignId")
  )

  useEffect(() => {
    if (selectedId) {
      localStorage.setItem("selectedCampaignId", selectedId)
    }
  }, [selectedId])

  const selected = campaigns.find((c) => c.id === selectedId)

  const combinedData =
    selected &&
    weekDays.map((day) => ({
      day,
      installs: selected.installs.find((d) => d.day === day)?.value ?? 0,
      revenue:
        "revenue" in selected
          ? (selected as any).revenue?.find((d: any) => d.day === day)?.value ?? 0
          : 0,
    }))

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Select a Campaign</CardTitle>
          <Select value={selectedId ?? ""} onValueChange={setSelectedId}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Choose a campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !selected && (
            <p className="text-muted-foreground">
              Select a campaign to view analytics.
            </p>
          )}
          {!loading && selected && combinedData && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="installs" name="Installs" fill="#4f46e5" stackId="a" />
                <Bar dataKey="revenue" name="Revenue" fill="#10b981" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
